export type Player = {
  name: string;
  id: string;
  countryCode: string;
  gamesPlayed: number;
  gamesWon: number;
  tournamentsPlayed: number;
  averageWinningOdd: number;
  averageLosingOdd: number;
  lastFiveGamesOdds: { sequence: number; odd: number; win: boolean }[];
};

type Game = {
  won: boolean;
};

export type OpponentGame = {
  opponentId: string;
  matchesPlayed: number;
  matchesWon: number; // matches won by the player (not the opponent)
  lastFive: { won: boolean }[];
};

export type PlayerRival = {
  playerId: string;
  opponents: OpponentGame[];
};

export type PlayerSurface = {
  name: string;
  axes: {
    axis: string;
    value: number;
  }[];
};

export type Surface = 'clay' | 'grass' | 'hard court' | 'carpet';
