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

@Component({
  selector: 'app-surface',
  templateUrl: './surface.component.html',
  styleUrls: ['./surface.component.scss']
})

export class SurfaceComponent implements OnInit {
  margin = { top: 20, right: 20, bottom: 20, left: 10 };
  chart!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

  @ViewChild('surfaceContainer')
  surfaceContainer!: ElementRef;

  data = [{
    "letter": "A",
    "frequency": 0.08167
  }, {
    "letter": "B",
    "frequency": 0.01492
  }, {
    "letter": "C",
    "frequency": 0.02782
  }, {
    "letter": "D",
    "frequency": 0.04253
  }, {
    "letter": "E",
    "frequency": 0.12702
  }]

  constructor() { }

  ngOnInit(): void {
    this.drawChart();
  }

  createSvg(): void {
    
  }

  createBars(): void {
    }

  createText(): void {
  }

  drawChart(): void {
    this.chart = d3
      .select('#surface-container')
      
    const data = this.data;

    const svg = this.chart.append('svg')
      .attr('width', '100%')
      .attr('height', 500);

    const contentWidth = 700;
    const contentHeight = 350;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data.map(d => d.letter));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => d.frequency) as number]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(10, '%'))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.letter) as number)
      .attr('y', d => y(d.frequency))
      .attr('width', x.bandwidth())
      .attr('height', d => contentHeight - y(d.frequency));
  }

}
