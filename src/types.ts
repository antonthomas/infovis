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

type Game = {
  won: boolean
}

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



export type Surface = 'clay' | 'grass' | 'hard court' | 'carpet';
