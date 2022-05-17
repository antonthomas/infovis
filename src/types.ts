export type Player = {
  name: string;
  id: string;
  countryCode: string;
  gamesPlayed: number;
  gamesWon: number;
  tournamentsPlayed: number;
  averageWinningOdd: number;
  averageLosingOdd: number;
  lastFiveGamesOdds: { sequence: number; odd: number; win: boolean; }[];
};

export type PlayerRival = {
  playerId: string,
  opponents: {
    opponentId: string,
    matchesPlayed: number,
    matchesWon: number,
    lastFive: string[]
  }[]
}



export type Surface = 'clay' | 'grass' | 'hard court' | 'carpet';
