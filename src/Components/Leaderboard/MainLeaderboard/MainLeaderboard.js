import dummydata from '../../../dummydata.json';
import LeaderboardSection from '../LeaderboardSection/LeaderboardSection';
import styles from './MainLeaderboard.module.scss';

const MainLeaderboard = () => {
  const rankOrder = ["Challenger", "Grandmaster", "Master", 
    "Diamond 1", "Diamond 2", "Diamond 3", "Diamond 4",
    "Emerald 1", "Emerald 2", "Emerald 3", "Emerald 4",
    "Platinum 1", "Platinum 2", "Platinum 3", "Platinum 4",
    "Gold 1", "Gold 2", "Gold 3", "Gold 4",
    "Silver 1", "Silver 2", "Silver 3", "Silver 4",
    "Bronze 1", "Bronze 2", "Bronze 3", "Bronze 4",
    "Iron 1", "Iron 2", "Iron 3", "Iron 4"];

  const filterAndSortPlayers = (rankKeyword, count) => {
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

  const playerCount = dummydata['users'].length;
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