import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// Importing supabase from client.js
import { supabase } from '../client';
import './EditCreator.css';

const EditCreator = ({ onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCreator();
  }, [id]);

  // Getting the content creator's information from the database
  const fetchCreator = async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError('Creator not found');
        console.error('Error fetching creator:', error);
      } else {
        // Loading the content creator's information into the form
        setFormData({
          name: data.name || '',
          url: data.url || '',
          description: data.description || '',
          imageURL: data.imageURL || ''
        });
      }
    } catch (error) {
      setError('Failed to fetch creator');
      console.error('Error fetching creator:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Asynchronous function to update the content creator in the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Name and description are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('creators')
        .update({
          name: formData.name.trim(),
          url: formData.url.trim() || null,
          description: formData.description.trim(),
          imageURL: formData.imageURL.trim() || null
        })
        .eq('id', id)
        .select('*')
        .single();

              if (error) {
          setError('Failed to update creator');
          console.error('Error updating creator:', error);
        } else {
          if (onUpdate) onUpdate(); // Refresh the creators list
          navigate(`/creator/${id}`);
        }
    } catch (error) {
      setError('Failed to update creator');
      console.error('Error updating creator:', error);
    } finally {
      setLoading(false);
    }
  };

  // Asynchronous function to delete a content creator from the database
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this creator? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('creators')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting creator:', error);
          alert('Failed to delete creator');
        } else {
          if (onUpdate) onUpdate(); // Refresh the creators list
          navigate('/');
        }
      } catch (error) {
        console.error('Error deleting creator:', error);
        alert('Failed to delete creator');
      }
    }
  };

  if (fetchLoading) {
    return (
      <div className="edit-creator">
        <div className="loading">Loading creator...</div>
      </div>
    );
  }

  if (error && fetchLoading) {
    return (
      <div className="edit-creator">
        <div className="error">
          <h2>{error}</h2>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-creator">
      <div className="form-container">
        <div className="form-header">
          <Link to={`/creator/${id}`} className="back-link">
            ← Back to Creator
          </Link>
          <h1>Edit Creator</h1>
          <p>Update the creator's information</p>
        </div>

        {/* Form for user to modify the name, url, description, and imageURL */}
        <form onSubmit={handleSubmit} className="creator-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Name field (required) */}
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter creator's name"
              required
            />
          </div>

          {/* URL field (optional) */}
          <div className="form-group">
            <label htmlFor="url">Channel URL</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://youtube.com/@creator"
            />
          </div>

          {/* Description field (required) */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about this creator..."
              rows="4"
              required
            />
          </div>

          {/* Image URL field (optional) */}
          <div className="form-group">
            <label htmlFor="imageURL">Profile Image URL (optional)</label>
            <input
              type="url"
              id="imageURL"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageURL && (
              <div className="image-preview">
                <img 
                  src={formData.imageURL} 
                  alt="Preview" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <Link to={`/creator/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
            {/* Submit button that calls the update function */}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Creator'}
            </button>
            {/* Delete button that calls the delete function */}
            <button 
              type="button"
              onClick={handleDelete}
              className="btn btn-delete"
              disabled={loading}
            >
              Delete Creator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCreator;
