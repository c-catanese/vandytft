import { useEffect, useState, useCallback } from 'react';
import LeaderboardSection from '../LeaderboardSection/LeaderboardSection';
import styles from './MainLeaderboard.module.scss';
import { useAppContext } from '../../../contexts/UserContext'

const MainLeaderboard = ( { users } ) => {
  const { loading } = useAppContext()
  const [challPlayers, setChallPlayers] = useState([]);
  const [gmPlayers, setGmPlayers] = useState([]);
  const [masterPlayers, setMasterPlayers] = useState([]);
  const [diamondPlayers, setDiamondPlayers] = useState([]);
  const [emeraldPlayers, setEmeraldPlayers] = useState([]);
  const [platinumPlayers, setPlatinumPlayers] = useState([]);
  const [goldPlayers, setGoldPlayers] = useState([]);
  const [silverPlayers, setSilverPlayers] = useState([]);
  const [bronzePlayers, setBronzePlayers] = useState([]);
  const [ironPlayers, setIronPlayers] = useState([]);
  const [unrankedPlayers, setUnrankedPlayers] = useState([]);

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
  
  const filterAndSortPlayers = useCallback(
    (rankKeyword) => {
      return users
        .filter(user => {
          // Match exactly the rank tier and division
          const userRank = user.tier.toUpperCase() + (user.division ? ` ${user.division.toUpperCase()}` : "");
          const keywordRank = rankKeyword.toUpperCase();
          
          // Exact match with optional division
          return userRank === keywordRank || user.tier.toUpperCase() === keywordRank;
        })
        .sort((a, b) => {
          // Construct rank strings for comparison
          const rankA = a.tier.toUpperCase() + (a.division ? ` ${a.division.toUpperCase()}` : "");
          const rankB = b.tier.toUpperCase() + (b.division ? ` ${b.division.toUpperCase()}` : "");
  
          // Find indexes in rankOrder
          const rankIndexA = rankOrder.findIndex(rank => rank === rankA);
          const rankIndexB = rankOrder.findIndex(rank => rank === rankB);
  
          // Handle cases where rank is not found in rankOrder
          if (rankIndexA === -1 || rankIndexB === -1) {
            console.error(`Rank not found in rankOrder: ${rankA} or ${rankB}`);
            return 0;
          }
  
          // Sort by rank order first, then by LP
          if (rankIndexA !== rankIndexB) {
            return rankIndexA - rankIndexB; // Sort by rank order
          }
          return b.lp - a.lp; // Sort by LP in descending order if ranks are the same
        });
    },
    []
  );

  useEffect(() => {
    if (!loading) {
      setChallPlayers(filterAndSortPlayers("CHALLENGER"));
      setGmPlayers(filterAndSortPlayers("GRANDMASTER"));
      setMasterPlayers(filterAndSortPlayers("MASTER"));
      setDiamondPlayers(filterAndSortPlayers("DIAMOND"));
      setEmeraldPlayers(filterAndSortPlayers("EMERALD"));
      setPlatinumPlayers(filterAndSortPlayers("PLATINUM"));
      setGoldPlayers(filterAndSortPlayers("GOLD"));
      setSilverPlayers(filterAndSortPlayers("SILVER"));
      setBronzePlayers(filterAndSortPlayers("BRONZE"));
      setIronPlayers(filterAndSortPlayers("IRON"));
      setUnrankedPlayers(filterAndSortPlayers("UNRANKED"));
    }
}, [filterAndSortPlayers, loading, users]);

  return(
    <div className={styles.leaderboardContainer}>
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