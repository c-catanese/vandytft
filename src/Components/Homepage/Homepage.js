"use client";

import UserInfo from '@/Components/UserInfo/UserInfo';
import dummydata from '../../dummydata.json';
import Leaderboard from '../Leaderboard/MainLeaderboard/MainLeaderboard';
import styles from './Homepage.module.scss';
import React, { useEffect, useState } from 'react';

const Homepage = () => {
  const user = dummydata.users[0]

  const [version, setVersion] = useState(null);

  useEffect(() => {
    async function fetchVersion() {
      try {
        const res = await fetch('/api/pgVersion');
        const data = await res.json();
        setVersion(data.version);
      } catch (error) {
        console.error('Error fetching PostgreSQL version:', error);
      }
    }

    fetchVersion();
  }, []);

  


  return(
    <div className={styles.homepageContainer}>
      <div>
        <h1>PostgreSQL Version</h1>
        {version ? <p>{version}</p> : <p>Loading...</p>}
      </div>
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