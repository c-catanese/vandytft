import Leaderboard from '../../../Components/Leaderboard/MainLeaderboard/MainLeaderboard';
import styles from './Homepage.module.scss';

const Homepage = () => {
 
  return(
    <div className={styles.homepageContainer}>
      <Leaderboard/>
    </div>
  )
}

export default Homepage