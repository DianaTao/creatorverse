import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// Importing supabase from client.js
import { supabase } from '../client';
import './ViewCreator.css';

const ViewCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Getting the content creator's information from the database
  const fetchCreator = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError('Creator not found');
        console.error('Error fetching creator:', error);
      } else {
        setCreator(data);
      }
    } catch (error) {
      setError('Failed to fetch creator');
      console.error('Error fetching creator:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCreator();
  }, [fetchCreator]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this creator?')) {
      try {
        console.log('Attempting to delete creator with ID:', id);
        
        // First, let's verify the creator exists
        const { error: checkError } = await supabase
          .from('creators')
          .select('id')
          .eq('id', id)
          .single();
          
        if (checkError) {
          console.error('Error checking creator existence:', checkError);
          alert(`Creator not found: ${checkError.message}`);
          return;
        }
        
        console.log('Creator found, proceeding with deletion');
        
        const { error } = await supabase
          .from('creators')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete error:', error);
          alert(`Failed to delete creator: ${error.message}`);
        } else {
          console.log('Creator deleted successfully');
          navigate('/');
        }
      } catch (error) {
        console.error('Catch block delete error:', error);
        alert(`Failed to delete creator: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleVisitChannel = () => {
    if (creator?.url) {
      window.open(creator.url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="view-creator">
        <div className="loading">Loading creator...</div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="view-creator">
        <div className="error">
          <h2>{error || 'Creator not found'}</h2>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="view-creator">
      <div className="creator-details">
        <div className="creator-header">
          <Link to="/" className="back-link">
            ← Back to Creators
          </Link>
        </div>

        <div className="creator-content">
          {/* Displaying the content creator's image */}
          {creator.imageURL && (
            <div className="creator-image">
              <img src={creator.imageURL} alt={creator.name} />
            </div>
          )}

          <div className="creator-info">
            {/* Displaying the content creator's name */}
            <h1 className="creator-name">{creator.name}</h1>
            
            {/* Displaying the content creator's URL */}
            {creator.url && (
              <div className="creator-url">
                <strong>Channel URL:</strong>
                <a href={creator.url} target="_blank" rel="noopener noreferrer">
                  {creator.url}
                </a>
              </div>
            )}

            {/* Displaying the content creator's description */}
            <div className="creator-description">
              <h3>About</h3>
              <p>{creator.description}</p>
            </div>

            <div className="creator-actions">
              {creator.url && (
                <button onClick={handleVisitChannel} className="btn btn-visit">
                  Visit Channel
                </button>
              )}
              {/* Button to edit creator information */}
              <Link to={`/edit/${creator.id}`} className="btn btn-edit">
                Edit Creator
              </Link>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Delete button clicked');
                  handleDelete();
                }} 
                className="btn btn-delete"
                type="button"
              >
                Delete Creator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCreator;
