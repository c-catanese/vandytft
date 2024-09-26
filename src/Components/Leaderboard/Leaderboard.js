import React from 'react';
import styles from './Leaderboard.module.scss'
import dummydata from '../../dummydata.json'

const Leaderboard = () => {
  const rankOrder = ["Challenger", "Grandmaster", "Master", 
    "Diamond 1", "Diamond 2", "Diamond 3", "Diamond 4",
    "Emerald 1", "Emerald 2", "Emerald 3", "Emerald 4",
    "Platinum 1", "Platinum 2", "Platinum 3", "Platinum 4",
    "Gold 1", "Gold 2", "Gold 3", "Gold 4",
    "Silver 1", "Silver 2", "Silver 3", "Silver 4",
    "Bronze 1", "Bronze 2", "Bronze 3", "Bronze 4",
    "Iron 1", "Iron 2", "Iron 3", "Iron 4"];

  const filterAndSortPlayers = (rankKeyword) => {
    return dummydata.users
        .filter(user => user.rank.includes(rankKeyword))
        .sort((a, b) => {
            const rankA = rankOrder.indexOf(a.rank);
            const rankB = rankOrder.indexOf(b.rank);
            if (rankA !== rankB) {
                return rankA - rankB; // Sort by rank order
            }
            return b.lp - a.lp; // Sort by LP in descending order if ranks are the same
        });
  };

  const users = filterAndSortPlayers(dummydata['users'])
  const challPlayers = filterAndSortPlayers("Challenger")
  const gmPlayers = filterAndSortPlayers("Grandmaster")
  const masterPlayers = filterAndSortPlayers("Master")
  const diamondPlayers = filterAndSortPlayers("Diamond")
  const emeraldPlayers = filterAndSortPlayers("Emerald")
  const platinumPlayers = filterAndSortPlayers("Platinum")
  const goldPlayers = filterAndSortPlayers("Gold")
  const silverPlayers = filterAndSortPlayers("Silver")
  const bronzePlayers = filterAndSortPlayers("Bronze")
  const ironPlayers = filterAndSortPlayers("Iron")
  const unrankedPlayers = filterAndSortPlayers("Unranked")

  return(
    <div className={styles.leaderboardContainer}>
      <div className={styles.userList}>
        <div className={styles.rankDelineator}>Challenger</div>
        <div className={styles.sectionHeading}>
          <p>Place</p>
          <p>Username</p>
          <p>Rank</p>
        </div>
        {challPlayers.map((user, index) => (
          <div key={index} className={styles.user}>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard