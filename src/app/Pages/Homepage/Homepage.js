import dummydata from '../../../dummydata.json';
import Leaderboard from '../../../Components/Leaderboard/MainLeaderboard/MainLeaderboard';
import styles from './Homepage.module.scss';

const Homepage = () => {
  const user = dummydata.users[0]
  return(
    <div className={styles.homepageContainer}>
      <h1 className={styles.title}>Your Profile</h1>
      <div className={styles.userContainer}>
        <div className={styles.section}>
          <span className={styles.place}>Place {0 + 1}</span>
          <div className={styles.smallSeperator}/>
        </div>
        <div className={styles.section}>
          <span className={styles.username}>Username: {user.username}</span>
          <div className={styles.smallSeperator}/>
        </div>
        <div className={styles.section}>
          <span className={styles.rank}>Rank: {user.rank} {user.lp} lp</span>
          <div className={styles.smallSeperator}/>
        </div>
        <div className={styles.section}>
          <span className={styles.classOf}>2022</span>
        </div>
      </div>
      <Leaderboard users={dummydata.users}/>
    </div>
  )
}

export default Homepage