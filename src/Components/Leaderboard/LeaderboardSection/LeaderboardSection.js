import UserInfo from '@/Components/UserInfo/UserInfo';
import styles from './LeaderboardSection.module.scss';

const LeaderboardSection = ({users, rank, countStart}) => {
  return(
    <div style={{ marginBottom: rank === 'Unranked' ? '200px' : '0'}}>
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
              year={'2022'}
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