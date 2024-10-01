import styles from './UserInfo.module.scss';

const UserInfo = ({user, place, header=false, cookie=false}) => {
  console.log(user)
  const titleCase = (str) => {
    if(str?.length){
    return str
        .toLowerCase()
        .split(' ') 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
        .join(' '); 
      }
};

  return(
    <div className={`${styles.user} ${header ? styles.lbHeading : ''} ${cookie ? styles.noPlace : ''}`}>
      <div className={`${styles.userSection} ${cookie ? styles.hidden : ''}`}>
        <span className={styles.place }>{header ? 'Place' : place}</span>
        <div className={`${header ? styles.seperator : styles.smallSeperator}`}/>
      </div>
      <div className={styles.userSection}>
        <span className={styles.username}>{header ? 'User' : (user.username) + '#' + user.tagline}</span>
        <div className={`${header ? styles.seperator : styles.smallSeperator}`}/>
      </div>
      <div className={styles.userSection}>
        <span className={styles.rank}>{header ? 'Rank' : titleCase(user.tier) + ' ' + user.lp + ' lp'}</span>
        <div className={`${header ? styles.seperator : styles.smallSeperator}`}/>
      </div>
      <div className={styles.userSection}>
        <span className={styles.classOf}>{header ? 'Year' : user.class}</span>
      </div>
    </div>
  )
}

export default UserInfo