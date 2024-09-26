import Leaderboard from '../../../Components/Leaderboard/MainLeaderboard/MainLeaderboard';
import styles from './Homepage.module.scss';
const Homepage = () => {
 
  return(
    <div className={styles.homepageContainer}>
      <div>
        <p>This site is for Vanderbilt TFT players to find and compare ranks with other students and alumni! If you would like to contribute to the site feel free to make a     <a href="https://github.com/yourusername/yourrepository" target="_blank" rel="noopener noreferrer">pull request on GitHub!</a>
        </p>
      </div>
      <Leaderboard/>
    </div>
  )
}

export default Homepage