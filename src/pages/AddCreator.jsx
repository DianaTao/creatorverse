import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Importing supabase from client.js
import { supabase } from '../client';
import './AddCreator.css';

const AddCreator = ({ onAdd }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Asynchronous function to add the new content creator to the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Name and description are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Log the data we're trying to insert
      const insertData = {
        name: formData.name.trim(),
        url: formData.url.trim() || null,
        description: formData.description.trim(),
        imageURL: formData.imageURL.trim() || null
      };
      
      console.log('Attempting to insert:', insertData);

      const { data, error } = await supabase
        .from('creators')
        .insert(insertData);

      if (error) {
        console.error('Supabase error details:', error);
        setError(`Failed to add creator: ${error.message}`);
      } else {
        console.log('Creator added successfully:', data);
        if (onAdd) onAdd(); // Refresh the creators list
        navigate('/');
      }
    } catch (error) {
      console.error('Catch block error:', error);
      setError(`Failed to add creator: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-creator">
      <div className="form-container">
        <div className="form-header">
          <Link to="/" className="back-link">
            ← Back to Creators
          </Link>
          <h1>Add New Creator</h1>
          <p>Share a content creator with the community</p>
        </div>

        {/* Form for user to enter details about the new content creator */}
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
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Creator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCreator;
