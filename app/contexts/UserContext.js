import React, { createContext, useState, useContext, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRanks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ranks');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true)
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
  };

  return (
    <AppContext.Provider value={{ users, loading, error, setLoading, setError, setUsers, updateRanks, fetchUsers }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);