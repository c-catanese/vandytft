import LeaderboardSection from '../leaderboardSection/leaderboardSection';
import styles from './mainLeaderboard.module.scss';

const MainLeaderboard = ( { users } ) => {
  const rankOrder = [
    "CHALLENGER", "GRANDMASTER", "MASTER", 
    "DIAMOND I", "DIAMOND II", "DIAMOND III", "DIAMOND IV",
    "EMERALD I", "EMERALD II", "EMERALD III", "EMERALD IV",
    "PLATINUM I", "PLATINUM II", "PLATINUM III", "PLATINUM IV",
    "GOLD I", "GOLD II", "GOLD III", "GOLD IV",
    "SILVER I", "SILVER II", "SILVER III", "SILVER IV",
    "BRONZE I", "BRONZE II", "BRONZE III", "BRONZE IV",
    "IRON I", "IRON II", "IRON III", "IRON IV"
];

const filterAndSortPlayers = (rankKeyword) => {
    return users
        .filter(user => {
            // Construct the rank string based on tier and division, convert to uppercase
            const userRank = user.tier.toUpperCase() + (user.division ? ` ${user.division.toUpperCase()}` : "");
            return userRank.includes(rankKeyword.toUpperCase());
        })
        .sort((a, b) => {
            // Construct rank strings for comparison
            const rankA = a.tier.toUpperCase() + (a.division ? ` ${a.division.toUpperCase()}` : "");
            const rankB = b.tier.toUpperCase() + (b.division ? ` ${b.division.toUpperCase()}` : "");
            const rankIndexA = rankOrder.indexOf(rankA);
            const rankIndexB = rankOrder.indexOf(rankB);
            
            // Sort by rank order first, then by LP
            if (rankIndexA !== rankIndexB) {
                return rankIndexA - rankIndexB; // Sort by rank order
            }
            return b.lp - a.lp; // Sort by LP in descending order if ranks are the same
        });
};

  // Example calls
  const challPlayers = filterAndSortPlayers("CHALLENGER");
  const gmPlayers = filterAndSortPlayers("GRANDMASTER");
  const masterPlayers = filterAndSortPlayers("MASTER")
  const diamondPlayers = filterAndSortPlayers("DIAMOND");
  const emeraldPlayers = filterAndSortPlayers("EMERALD");
  const platinumPlayers = filterAndSortPlayers("PLATINUM");
  const goldPlayers = filterAndSortPlayers("GOLD");
  const silverPlayers = filterAndSortPlayers("SILVER");
  const bronzePlayers = filterAndSortPlayers("BRONZE");
  const ironPlayers = filterAndSortPlayers("IRON");
  const unrankedPlayers = filterAndSortPlayers("UNRANKED");

  return(
    <div className={styles.leadeboardContainer}>
        <LeaderboardSection users={challPlayers} rank={'Challenger'} countStart={1}/>
        <LeaderboardSection users={gmPlayers} rank={'Grandmaster'} countStart={challPlayers.length + 1}/>
        <LeaderboardSection users={masterPlayers} rank={'Master'} countStart={challPlayers.length + gmPlayers.length + 1}/>
        <LeaderboardSection users={diamondPlayers} rank={'Diamond'} countStart={challPlayers.length + gmPlayers.length + masterPlayers.length + 1}/>
        <LeaderboardSection users={emeraldPlayers} rank={'Emerald'} countStart={challPlayers.length + gmPlayers.length + masterPlayers.length + diamondPlayers.length + 1}/>
        <LeaderboardSection users={platinumPlayers} rank={'Platinum'} countStart={challPlayers.length + gmPlayers.length + masterPlayers.length + diamondPlayers.length + emeraldPlayers.length + 1}/>
        <LeaderboardSection users={goldPlayers} rank={'Gold'} countStart={challPlayers.length + gmPlayers.length + masterPlayers.length + diamondPlayers.length + emeraldPlayers.length + platinumPlayers.length + 1}/>
        <LeaderboardSection users={silverPlayers} rank={'Silver'} countStart={challPlayers.length + gmPlayers.length + masterPlayers.length + diamondPlayers.length + emeraldPlayers.length + platinumPlayers.length + goldPlayers.length + 1}/>
        <LeaderboardSection users={bronzePlayers} rank={'Bronze'} countStart={challPlayers.length + gmPlayers.length + masterPlayers.length + diamondPlayers.length + emeraldPlayers.length + platinumPlayers.length + goldPlayers.length + silverPlayers.length + 1}/>
        <LeaderboardSection users={ironPlayers} rank={'Iron'} countStart={challPlayers.length + gmPlayers.length + masterPlayers.length + diamondPlayers.length + emeraldPlayers.length + platinumPlayers.length + goldPlayers.length + silverPlayers.length + bronzePlayers.length + 1}/>
        <LeaderboardSection users={unrankedPlayers} rank={'Unranked'} countStart={challPlayers.length + gmPlayers.length + masterPlayers.length + diamondPlayers.length + emeraldPlayers.length + platinumPlayers.length + goldPlayers.length + silverPlayers.length + bronzePlayers.length + ironPlayers.length + 1}/>
    </div>
  )
}

export default MainLeaderboard