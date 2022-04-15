import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
 *
 */

type surface = 'clay' | 'grass' | 'hard court';

@Component({
  selector: 'app-rival',
  templateUrl: './rival.component.html',
  styleUrls: ['./rival.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RivalComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    let data = [560, 350]; // here are the data values; v1 = total, v2 = current value

    let chart = d3
      .select('#rival-container')
      .append('svg') // creating the svg object inside the container div
      .attr('class', 'chart')
      .attr('width', 200) // bar has a fixed width
      .attr('height', 20 * data.length);

    // const num = d3.max(data) ?? 560;
    const num = 560;
    // const x = d3.scaleLinear([0, 200]).domain([0, num]);
    let x = d3Scale.scaleLinear([0, 200]).domain([0, num]);
    // .linear() // takes the fixed width and creates the percentage from the data values
    // .domain([0, d3.max(data)])
    // .range([0, 200]);

    chart
      .selectAll('rect') // this is what actually creates the bars
      .data(data)
      .enter()
      .append('rect')
      .attr('width', x)
      .attr('height', 20)
      .attr('rx', 5) // rounded corners
      .attr('ry', 5);

    chart
      .selectAll('text') // adding the text labels to the bar
      .data(data)
      .enter()
      .append('text')
      .attr('x', x)
      .attr('y', 10) // y position of the text inside bar
      .attr('dx', -3) // padding-right
      .attr('dy', '.35em') // vertical-align: middle
      .attr('text-anchor', 'end') // text-align: right
      .text(String);
  }
}
