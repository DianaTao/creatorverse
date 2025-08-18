import { Link } from 'react-router-dom';
import Card from '../components/Card';
import './ShowCreators.css';

const ShowCreators = ({ creators, loading, error, onDelete }) => {

  if (loading) {
    return (
      <div className="show-creators">
        <div className="loading">Loading creators...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="show-creators">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="show-creators">
      <header className="page-header">
        <h1>Creatorverse</h1>
        <p>Discover amazing content creators</p>
        {/* Only show Add button in header when creators exist */}
        {creators.length > 0 && (
          <Link to="/add" className="btn btn-primary">
            Add New Creator
          </Link>
        )}
      </header>

      {/* Display a message if there are no content creators in the database */}
      {creators.length === 0 ? (
        <div className="empty-state">
          <h2>No creators found</h2>
          <p>Be the first to add a content creator!</p>
          <Link to="/add" className="btn btn-primary">
            Add Your First Creator
          </Link>
        </div>
      ) : (
        <div className="creators-grid">
          {/* Creating content creator components for each one in the database */}
          {creators.map((creator) => (
            <Card
              key={creator.id}
              creator={creator}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowCreators;
