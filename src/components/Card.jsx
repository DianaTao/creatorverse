import { Link } from 'react-router-dom';
import { supabase } from '../client';
import './Card.css';

const Card = ({ creator, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this creator?')) {
      try {
        const { error } = await supabase
          .from('creators')
          .delete()
          .eq('id', creator.id);

        if (error) {
          console.error('Error deleting creator:', error);
          alert('Failed to delete creator');
        } else {
          onDelete(creator.id);
        }
      } catch (error) {
        console.error('Error deleting creator:', error);
        alert('Failed to delete creator');
      }
    }
  };

  const handleVisitChannel = () => {
    if (creator.url) {
      window.open(creator.url, '_blank');
    }
  };

  return (
    <div className="card">
      {/* Display content creator's image */}
      {creator.imageURL && (
        <div className="card-image">
          <img src={creator.imageURL} alt={creator.name} />
        </div>
      )}
      
      <div className="card-content">
        {/* Display content creator's name */}
        <h3 className="card-title">{creator.name}</h3>
        
        {/* Display content creator's URL if available */}
        {creator.url && (
          <div className="card-url">
            <a href={creator.url} target="_blank" rel="noopener noreferrer">
              {creator.url}
            </a>
          </div>
        )}
        
        {/* Display content creator's description */}
        <p className="card-description">{creator.description}</p>
        
        <div className="card-actions">
          <Link to={`/creator/${creator.id}`} className="btn btn-primary">
            View Details
          </Link>
          {creator.url && (
            <button onClick={handleVisitChannel} className="btn btn-secondary">
              Visit Channel
            </button>
          )}
          {/* Button to edit creator information */}
          <Link to={`/edit/${creator.id}`} className="btn btn-edit">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
