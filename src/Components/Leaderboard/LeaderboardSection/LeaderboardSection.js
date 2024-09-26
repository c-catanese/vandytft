import styles from './LeaderboardSection.module.scss';

const LeaderboardSection = ({users, rank, countStart}) => {
  console.log(users)
  return(
    <>
      <div className={styles.rankDelineator}>{rank}</div>
      {users.length ? (
        <>
          <div className={styles.sectionHeading}>
            <div className={styles.lbSection}>
              <p className={styles.place}>Place</p>
              <div className={styles.seperator}/>
            </div>
            <div className={styles.lbSection}>
              <p className={styles.username}>Username</p>
              <div className={styles.seperator}/>
            </div>
            <p className={styles.rank}>Rank</p>
          </div>
          {users.map((user, index) => (
            <div key={index} className={styles.user}>
              <div className={styles.lbSection}>
                <p className={styles.place}>{index + countStart}</p>
                <div className={styles.smallSeperator}/>
              </div>
              <div className={styles.lbSection}>
                <p className={styles.username}>{user.username}</p>
                <div className={styles.smallSeperator}/>
              </div>
              <span className={styles.rank}>{user.rank} {user.lp} lp</span>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.sectionHeading}>
          <p>No {rank} players</p>
        </div>
      )}
  </>
  )
}

export default LeaderboardSection