import UserInfo from '../../userInfo/userInfo';
import styles from './leaderboardSection.module.scss';

const LeaderboardSection = ({users, rank, countStart}) => {
  return(
    <div className={styles.lbSectionContainer}>
      {users.length ? (
        <>
        <h2 className={styles.rankDelineator}><a className={`${styles.rankLogo} ${styles[`${rank}`]}`}></a>{rank}<a className={`${styles.rankLogo} ${styles[`${rank}`]}`}></a></h2>
          <UserInfo header={true}/>
          {users.map((user, index) => (
            <UserInfo 
              key={index} 
              user={user} 
              rank={rank} 
              place={index + countStart} 
            />
          ))}
        </>
      ) : (
        <></>
        // <div className={styles.noPlayers}>
        //   <span className={styles.noPlayer}>No {rank} Players</span>
        // </div>
      )}
  </div>
  )
}

export default LeaderboardSection