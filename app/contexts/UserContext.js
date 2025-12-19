import React, { createContext, useState, useContext, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setLoading(false);
      setUsers(data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async (email) => {
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      setUser(data[0]);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const updateRanks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      // Call the PUT endpoint to update ranks
      const res = await fetch('/api/ranks', {
        method: 'PUT',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update ranks');
      }

      // Log the update results for debugging
      console.log('Update ranks result:', data);

      // Show user feedback if any updates failed
      if (data.failed > 0) {
        console.warn(`${data.failed} users failed to update`);
      }

      // After updating, fetch the latest user data
      await fetchUsers();
    } catch (error) {
      console.error('Update ranks error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);



  return (
    <AppContext.Provider value={{ users, user, loading, error, setLoading, setError, setUsers, updateRanks, fetchUsers, fetchUserData, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);