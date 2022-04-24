import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  player: BehaviorSubject<string> = new BehaviorSubject<string>('Albert Ramos Vinolas');  // TODO - Get first name of list

  constructor() { }

  setPlayer(player: string) {
    this.player.next(player);
  }

  getPlayer(): BehaviorSubject<string> {
    return this.player;
  }
}
