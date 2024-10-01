"use client";

import { useEffect, useState } from 'react';
import Leaderboard from '../Leaderboard/MainLeaderboard/MainLeaderboard';
import UserInfo from '../UserInfo/UserInfo';
import styles from './Homepage.module.scss';


const Homepage = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users'); 
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setUsers(data); 
        setLoading(false)
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message); 
        setLoading(false)
      }
    }
    fetchUsers();
  }, []);


  return(
    <div className={styles.homepageContainer}>
      {loading && (
        <h1 className={styles.loading}>
          Loading...
        </h1>
      )}
      {user && (
        <div className={styles.column} >
          <h1 className={styles.title}>Your Profile</h1>
          <UserInfo user={user} cookie={true}/>
        </div>
      )}
      <Leaderboard users={users}/>
    </div>
  )
}

export default Homepage