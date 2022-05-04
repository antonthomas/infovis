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
    { sequence: 1, odd: 0.48, win: true },
    { sequence: 2, odd: 0.98, win: false },
    { sequence: 3, odd: 1.5, win: true },
    { sequence: 4, odd: 0.87, win: false },
    { sequence: 5, odd: 3.21, win: true }
  ]

  constructor() { }

  ngAfterViewInit(): void {
    let svg: any = d3.select(`#svg-betting-${this.htmlId}`)
    // @ts-ignore
    const width = d3.select('.overview-opponent').node().getBoundingClientRect().width - 32
    console.log(width)

    svg.append("line")
      .style("stroke", "#ccc")
      .style("stroke-width", 1)
      .attr("x1", 0)
      .attr("y1", 25)
      .attr("x2", width)
      .attr("y2", 25);


    svg.selectAll('circle')
      .data(this.data)
      .join("circle")
      .attr("cx", (d: any) => d.sequence * (width / 5) - (width / 10))
      .attr("cy", (d: any) => 25 + this.calcYOffset(d.odd))
      .attr("r", 5)
      .style("fill", (d: any) => d.win ? 'green' : 'red');
  }

  calcYOffset(odd: number): number {
    if (odd < 0.5) return 10;
    else if (odd < 0.9) return 5;
    else if (odd < 1.11) return 0;
    else if (odd < 2) return -5;
    else return -10;
  }

}
