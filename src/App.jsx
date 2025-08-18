import { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { supabase } from './client';
import ShowCreators from './pages/ShowCreators';
import ViewCreator from './pages/ViewCreator';
import AddCreator from './pages/AddCreator';
import EditCreator from './pages/EditCreator';
import './App.css';

function App() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useEffect to fetch data from database
  useEffect(() => {
    // Asynchronous function to fetch creators from database
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('creators')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          setError('Failed to fetch creators');
          console.error('Error fetching creators:', error);
        } else {
          setCreators(data || []);
        }
      } catch (error) {
        setError('Failed to fetch creators');
        console.error('Error fetching creators:', error);
      } finally {
        setLoading(false);
      }
    };

    // Call the function to fetch data
    fetchCreators();
  }, []);

  // Function to handle creator deletion
  const handleCreatorDelete = (deletedId) => {
    setCreators(creators.filter(creator => creator.id !== deletedId));
  };

  // Function to refresh creators data
  const refreshCreators = async () => {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error refreshing creators:', error);
      } else {
        setCreators(data || []);
      }
    } catch (error) {
      console.error('Error refreshing creators:', error);
    }
  };

  // Define the routes using useRoutes hook
  const element = useRoutes([
    {
      path: "/",
      element: <ShowCreators 
        creators={creators} 
        loading={loading} 
        error={error}
        onDelete={handleCreatorDelete}
      />
    },
    {
      path: "/creator/:id",
      element: <ViewCreator />
    },
    {
      path: "/edit/:id", 
      element: <EditCreator onUpdate={refreshCreators} />
    },
    {
      path: "/add",
      element: <AddCreator onAdd={refreshCreators} />
    }
  ]);

  return (
    <div className="app">
      {element}
    </div>
  );
}

export default App;
