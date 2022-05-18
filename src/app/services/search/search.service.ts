import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Player, PlayerRival, OpponentGame, PlayerSurface } from '../../../types';
import playerJSON from '../../../assets/data/players.json';
import playerRivalSurface from '../../../assets/data/playerSurface.json';
import playerRivals from '../../../assets/data/playerRivals.json'

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  players: Player[] = playerJSON;
  playerRivalMatches: PlayerRival[] = playerRivals
  playerSurfaces: PlayerSurface[] = playerRivalSurface
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
    console.log('Set player', name);
    let player: Player | undefined = this.players.find((p) => p.name === name);
    if (player) this.player.next(player);
    else console.error("setPlayer: player with 'name'" + name + 'not found.');
  }

  setOpponent(name: string) {
    console.log('Set opponent', name);
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
    var playerGames = this.playerRivalMatches.filter((x:PlayerRival) => (x.playerId === pId))
    var playerRivalPair = playerGames[0].opponents.filter(o => o.opponentId == oId)
    return playerRivalPair[0]
  }

  filterSurface(pName: string, oName: string): PlayerSurface[] {
    var playerSurface = this.playerSurfaces.filter((x: PlayerSurface) => (x.name == pName || x.name == oName))
    console.log("----------------")
    console.log(pName)
    if (playerSurface[0].name == oName)
      playerSurface.reverse();
    return playerSurface
  } 
}
