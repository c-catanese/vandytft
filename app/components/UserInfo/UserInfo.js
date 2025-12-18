import styles from './UserInfo.module.scss';

const UserInfo = ({user, place, header=false, cookie=false}) => {
  const titleCase = (str) => {
    if(str?.length){
    return str
        .toLowerCase()
        .split(' ') 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
        .join(' '); 
      }
};
  const rerouteToLolchess = () => {
    if(user.username && user.tagline){
      window.location.href = `https://lolchess.gg/profile/na/${user.username}-${user.tagline}/set16`;
    }
  };

  return(
    <div onClick={rerouteToLolchess} className={`${styles.user} ${header ? styles.lbHeading : ''} ${cookie ? styles.noPlace : ''}`}>
      <div className={`${styles.userSection} ${cookie ? styles.hidden : ''} ${styles.placeContainer}`}>
        <span className={styles.place }>{header ? 'Place' : place}</span>
        <div className={`${header ? styles.seperator : styles.smallSeperator}`}/>
      </div>
      <div className={styles.userSection}>
        <span className={styles.username}>{header ? 'User' : (user.username) + '#' + user.tagline}</span>
        <div className={`${header ? styles.seperator : styles.smallSeperator}`}/>
      </div>
      <div className={styles.userSection}>
        <span className={styles.rank}>{header ? 'Rank' : (user.tier === 'MASTER' || user.tier === 'GRANDMASTER' || user.tier === 'CHALLENGER' ? titleCase(user.tier) + ' ' + user.lp + ' lp' : titleCase(user.tier) + ' ' + user.division + ' ' + user.lp + ' lp')}
        </span>
        <div className={`${header ? styles.seperator : styles.smallSeperator}`}/>
      </div>
      <div className={styles.userSection}>
        <span className={styles.classOf}>{header ? 'Class' : user.class}</span>
      </div>
    </div>
  )
}

export default UserInfo