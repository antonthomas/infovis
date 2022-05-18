import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Player, PlayerRival, OpponentGame, PlayerSurface, PerformanceStats, OpponentsPerformanceStats, SingleOpponentPerformanceStats } from '../../../types';
import playerJSON from '../../../assets/data/players.json';
import playerRivalSurface from '../../../assets/data/playerSurface.json';
import playerRivals from '../../../assets/data/playerRivals.json'
import allPerformanceStats from '../../../assets/data/performanceStats.json'

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  players: Player[] = playerJSON;
  playerRivalMatches: PlayerRival[] = playerRivals
  playerSurfaces: PlayerSurface[] = playerRivalSurface
  allPerformance: OpponentsPerformanceStats[] = allPerformanceStats
  player: BehaviorSubject<Player> = new BehaviorSubject<Player>(
    this.players[0]
  );
  opponent: BehaviorSubject<Player> = new BehaviorSubject<Player>(
    this.players[3]
  );

  constructor() {
    this.players = playerJSON;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getPlayerNames(): string[] {
    return this.players.map((p) => p.name);
  }

  setPlayer(name: string) {
    let player: Player | undefined = this.players.find((p) => p.name === name);
    if (player) this.player.next(player);
    else console.error("setPlayer: player with 'name'" + name + 'not found.');
  }

  setOpponent(name: string) {
    let opponent: Player | undefined = this.players.find(
      (p) => p.name === name
    );
    if (opponent) this.opponent.next(opponent);
    else console.error("setOpponent: player with 'name'" + name + 'not found.');
  }

  getPlayer(): BehaviorSubject<Player> {
    return this.player;
  }

  getOpponent(): BehaviorSubject<Player> {
    return this.opponent;
  }

  getWinPercentage(id: string): number {
    return 50;
  }

  isOpponent(id: string): boolean {
    return id === this.getOpponent().getValue().id;
  }

  filterRival(pId: string, oId: string): OpponentGame {
    const playerGames = this.playerRivalMatches.filter(
      (x: PlayerRival) => x.playerId === pId
    );
    const playerRivalPair = playerGames[0].opponents.filter(
      (o) => o.opponentId == oId
    );
    return playerRivalPair[0];
  }

  filterSurface(pName: string, oName: string): PlayerSurface[] {
    var playerSurface = this.playerSurfaces.filter((x: PlayerSurface) => (x.name == pName || x.name == oName))
    if (playerSurface[0].name == oName)
      playerSurface.reverse();
    return playerSurface
  } 

  filterPerformance(pId: string, oId: string): PerformanceStats[] {
    var p = this.allPerformance.filter((x:OpponentsPerformanceStats) => x.playerId == pId)[0]
    var o = p.opponents.filter((x:SingleOpponentPerformanceStats) => x.opponentId == oId)[0]
    console.log(o.values)
    return o.values
  }
}
