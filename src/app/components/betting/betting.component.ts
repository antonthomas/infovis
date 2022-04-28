import { AfterViewInit, Component, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-betting',
  templateUrl: './betting.component.html',
  styleUrls: ['./betting.component.scss']
})
export class BettingComponent implements AfterViewInit {
  @Input() htmlId = '';
  data = [
    { sequence: 1, odd: 0.98, win: true },
    { sequence: 2, odd: 0.98, win: true },
    { sequence: 3, odd: 0.98, win: true },
    { sequence: 4, odd: 0.98, win: true },
    { sequence: 5, odd: 0.98, win: true }
  ]

  constructor() { }

  ngAfterViewInit(): void {
    let svg = d3.select(`#svg-${this.htmlId}`)


    svg.selectAll('circle')
      .data(this.data)
      .join("circle")
      .attr("cx", (d: any) => d.sequence * 30)
      .attr("cy", 100)
      .attr("r", (d: any) => d.odd / 20);
  }

}
