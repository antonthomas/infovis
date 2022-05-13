import { Component } from '@angular/core';
import { SearchService } from './services/search/search.service';
import { Player } from '../types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Tennis Betting Dashboard';
  // @ts-ignore
  player: Player;
  // @ts-ignore
  opponent: Player;

  constructor(private search: SearchService) {
    this.search.getPlayer().subscribe({ next: (p) => (this.player = p) });
    this.search.getOpponent().subscribe({ next: (p) => (this.opponent = p) });
  }
}
