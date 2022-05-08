import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  playerControl = new FormControl();
  opponentControl = new FormControl();
  options: string[] = [];
  filteredOptionsPlayer: Observable<string[]> | undefined;
  filteredOptionsOpponent: Observable<string[]> | undefined;

  constructor(private search: SearchService) {
    this.options = this.search.getPlayerNames();
  }

  ngOnInit(): void {
    this.filteredOptionsPlayer = this.playerControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.filteredOptionsOpponent = this.opponentControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  updatePlayer(event: any) {
    console.log('a', event);
    this.search.setPlayer(event.option.value);
  }

  // TODO: this method is not being called...
  // It does work when commenting out first form field in HTML
  updateOpponent(event: any) {
    console.log('b', event);
    this.search.setOpponent(event.option.value);
  }
}
