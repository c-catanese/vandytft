import styles from './UserInfo.module.scss';

const UserInfo = ({user, place, year, header=false}) => {
  

  return(
    <div className={`${styles.user} ${header ? styles.lbHeading : ''}`}>
      <div className={styles.userSection}>
        <span className={styles.place}>{header ? 'Place' : place}</span>
        <div className={`${header ? styles.seperator : styles.smallSeperator}`}/>
      </div>
      <div className={styles.userSection}>
        <span className={styles.username}>{header ? 'User' : user.username}</span>
        <div className={`${header ? styles.seperator : styles.smallSeperator}`}/>
      </div>
      <div className={styles.userSection}>
        <span className={styles.rank}>{header ? 'Rank' : user.rank + ' ' + user.lp + ' lp'}</span>
        <div className={`${header ? styles.seperator : styles.smallSeperator}`}/>
      </div>
      <div className={styles.userSection}>
        <span className={styles.classOf}>{header ? 'Year' : year}</span>
      </div>
    </div>
  )
}

export default UserInfo