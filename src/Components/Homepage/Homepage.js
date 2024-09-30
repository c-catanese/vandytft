"use client";

import UserInfo from '@/Components/UserInfo/UserInfo';
import dummydata from '../../dummydata.json';
import Leaderboard from '../Leaderboard/MainLeaderboard/MainLeaderboard';
import styles from './Homepage.module.scss';
import React, { useEffect, useState } from 'react';

const Homepage = () => {
  const user = dummydata.users[0]

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/pgVersion'); // Adjust this to your correct API path
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setUsers(data); // Assuming the data is an array of users
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message); // Store the error message in state for display
      }
    }

    fetchUsers();
  }, []);

  


  return(
    <div className={styles.homepageContainer}>
      {user && (
        <div className={styles.column} >
          <h1 className={styles.title}>Your Profile</h1>
          <UserInfo user={user} year={'2022'} place={'8'}/>
        </div>
      )}
      <Leaderboard users={dummydata.users}/>
    </div>
  )
}

export default Homepage