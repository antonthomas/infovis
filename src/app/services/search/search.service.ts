import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Player } from '../../../types';
import playerJSON from '../../../assets/data/players.json';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  players: Player[] = playerJSON;
  player: BehaviorSubject<Player> = new BehaviorSubject<Player>(
    this.players[0]
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

  getPlayer(): BehaviorSubject<Player> {
    return this.player;
  }
}
