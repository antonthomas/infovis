import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { map, Observable, startWith } from 'rxjs';
import { ColorService } from 'src/app/services/color.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  // f = new FormControl();

  constructor() {
    // this.f.valueChanges.subscribe((x) => {
    //   this.colorService.setColorblind(x);
    // });
  }
}
