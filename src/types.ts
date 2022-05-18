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

export type OpponentGame = {
  opponentId: string,
  matchesPlayed: number,
  matchesWon: number,
  lastFive: {won: boolean}[]
}

export type PlayerRival = {
  playerId: string,
  opponents: OpponentGame[]
}

export type PlayerSurface = {
  name: string,
  axes: {
    axis: string, value: number
  }[]
}

export type PerformanceStats = {
  player: number,
  opponent: number,
  average: number,
  playerLast5: number,
  opponentLast5: number,
  metric: string
}

export type SingleOpponentPerformanceStats = {
  opponentId: string,
  values: PerformanceStats[]
}

export type OpponentsPerformanceStats = {
  playerId: string,
  opponents: SingleOpponentPerformanceStats[]
}


export type Surface = 'clay' | 'grass' | 'hard court' | 'carpet';
