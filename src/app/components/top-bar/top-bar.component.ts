import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { SearchService } from 'src/app/services/search/search.service';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  playerControl = new FormControl();
  options: string[] = ['Albert Ramos Vinolas', 'Alejandro Andino Vallverdu', 'Alessandro Giannessi'];
  filteredOptions: Observable<string[]> | undefined;

  constructor(private search: SearchService) { }

  ngOnInit(): void {
    this.filteredOptions = this.playerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  updatePlayer(event: any) {
    this.search.setPlayer(event.option.value);
  }
}
