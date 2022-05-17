import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private colorblind: boolean = true;

  private playerColorBlind: string = '#6dadee';
  opponentColorBlind: string = '#ea6f59';

  private _playerColor: string = '#6fd371';
  private _opponentColor: string = '#ea6f59';

  constructor() {}

  setColorblind(b: boolean): void {
    this.colorblind = true;
  }

  playerColor(): string {
    if (this.colorblind) return this.playerColorBlind;
    else return this._playerColor;
  }

  opponentColor(): string {
    if (this.colorblind) return this.opponentColorBlind;
    else return this._opponentColor;
  }
}
