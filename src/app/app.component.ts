import { Component } from '@angular/core';
import { SearchService } from './services/search/search.service';
import { Player } from '../types';
import { ColorService } from './services/color.service';

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

  playerColor: string;
  opponentColor: string;

  constructor(
    private search: SearchService,
    private colorService: ColorService
  ) {
    this.search.getPlayer().subscribe({ next: (p) => (this.player = p) });
    this.search.getOpponent().subscribe({ next: (p) => (this.opponent = p) });
    this.playerColor = this.colorService.playerColor();
    this.opponentColor = this.colorService.opponentColor();
  }
}
