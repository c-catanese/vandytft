"use client";

import { useEffect } from 'react';
import Leaderboard from '../Leaderboard/MainLeaderboard/MainLeaderboard';
import UserInfo from '../UserInfo/UserInfo';
import styles from './Homepage.module.scss';
import { useAppContext } from '../../contexts/UserContext'
import Cookies from 'js-cookie';


const Homepage = () => {
  const {users, loading, fetchUsers, user, fetchUserData} = useAppContext()
  const email = Cookies.get('userEmail');

  useEffect(() => {
    if(email){
      fetchUserData(email);
    }
    fetchUsers();
  }, []);

  return(
    <div className={styles.homepageContainer}>
      {user && !loading && (
        <div className={styles.column} >
          <h1 className={styles.title}>Your Profile</h1>
          <UserInfo user={user} cookie={true}/>
        </div>
      )}
      {loading && (
        <h1 className={styles.loading}>
          Loading
        </h1>
      )}
      {!loading && <Leaderboard users={users}/>}
    </div>
  )
}

export default Homepage