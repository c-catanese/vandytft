import dummydata from '../../../dummydata.json';
import Leaderboard from '../../../Components/Leaderboard/MainLeaderboard/MainLeaderboard';
import styles from './Homepage.module.scss';
import UserInfo from '@/Components/UserInfo/UserInfo';

const Homepage = () => {
  const user = dummydata.users[0]
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