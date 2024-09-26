import styles from './LeaderboardSection.module.scss';

const LeaderboardSection = ({users, rank, countStart}) => {
  return(
    <div style={{ marginBottom: rank === 'Unranked' ? '200px' : '0', marginTop: rank === 'Challenger' ? '20px' : '40px' }}>
      <div className={styles.rankDelineator}><a className={`${styles.rankLogo} ${styles[`${rank}`]}`}></a>{rank}</div>
      {users.length ? (
        <>
          <div className={styles.sectionHeading}>
            <div className={styles.lbSection}>
              <span>Place</span>
              <div className={styles.seperator}/>
            </div>
            <div className={styles.lbSection}>
              <span className={styles.username}>Username</span>
              <div className={styles.seperator}/>
            </div>
            <div className={styles.lbSection}>
              <span className={styles.rank}>Rank</span>
              <div className={styles.seperator}/>
            </div>
            <div className={styles.lbSection}>
              <span className={styles.classOf}>Graduation Class</span>
            </div>
          </div>
          {users.map((user, index) => (
            <div key={index} className={styles.user}>
              <div className={styles.lbSection}>
                <span>{index + countStart}</span>
                <div className={styles.smallSeperator}/>
              </div>
              <div className={styles.lbSection}>
                <span className={styles.username}>{user.username}</span>
                <div className={styles.smallSeperator}/>
              </div>
              <div className={styles.lbSection}>
                <span className={styles.rank}>{user.rank} {user.lp} lp</span>
                <div className={styles.smallSeperator}/>
              </div>
              <div className={styles.lbSection}>
                <span className={styles.classOf}>2022</span>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.sectionHeading}>
          <span>No {rank} players</span>
        </div>
      )}
  </div>
  )
}

export default LeaderboardSection