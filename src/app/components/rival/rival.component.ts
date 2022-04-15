import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';

/**
 * Necessary data:
 *  - Player 1
 *    -> name
 *    -> nationality + flag
 *  - Player 2
 *    -> name
 *    -> nationality + flag
 *  - Amount of games between p1 & p2 played on surface x
 *    -> Including who won
 *  - Last 5 games between p1 & p2 played on surface x
 *    -> Including who won
 *
 * Tutorials:
 *  - https://bl.ocks.org/sarahob/1e291c95c4169ddabb77bbd10b6a7ef7
 *  - http://bl.ocks.org/nelliemckesson/5315143
 */

type surface = 'clay' | 'grass' | 'hard court';

@Component({
  selector: 'app-rival',
  templateUrl: './rival.component.html',
  styleUrls: ['./rival.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RivalComponent implements OnInit, AfterViewInit {
  width: number = 0;
  height: number = 0;
  data: number[] = [100, 35];
  chart!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

  @ViewChild('rivalContainer')
  rivalContainer!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    this.width = this.rivalContainer.nativeElement.offsetWidth;
    this.height = this.rivalContainer.nativeElement.offsetHeight;
  }

  ngOnInit(): void {
    this.drawChart();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: any } }) {
    // console.log('width: ', this.width);
    // console.log('height', this.height);
  }

  createSvg(): void {
    this.chart = d3
      .select('#rival-container')
      .append('svg') // creating the svg object inside the container div
      .attr('class', 'chart')
      .attr('width', '100%')
      .attr('height', 20 * this.data.length);
  }

  createBars(): void {
    let x = d3Scale.scaleLinear([0, '100%']).domain([0, 100]);
    this.chart
      .selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('width', x)
      .attr('height', 20)
      .attr('rx', 5)
      .attr('ry', 5);
  }

  createText(): void {
    let x = d3Scale.scaleLinear([0, '100%']).domain([0, 100]);
    this.chart
      .selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .attr('x', x)
      .attr('y', 10) // y position of the text inside bar
      .attr('dx', -3) // padding-right
      .attr('dy', '.35em') // vertical-align: middle
      .attr('text-anchor', 'end') // text-align: right
      .text(String);
  }

  drawChart(): void {
    this.createSvg();
    this.createBars();
    this.createText();
  }
}
