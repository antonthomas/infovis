import { AfterViewInit, Component, Input } from '@angular/core';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3';

// set the dimensions and margins of the graph

function calcPercent(percent: number) {
  return [percent, 100 - percent];
}

interface Data {
  quantity: number;
  category: string;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements AfterViewInit {
  @Input() htmlId = '';
  @Input() barColor = '';

  //initial dimensions
  width = 120;
  height = 120;
  margin = 40;
  radius = Math.min(this.width, this.height) / 2 - this.margin;

  data: Data[] = [
    {
      quantity: 30, //winning percentage
      category: 'a',
    },
    {
      quantity: 70, //remainder (100 - winning %)
      category: 'b',
    },
  ];

  constructor() {}

  ngAfterViewInit(): void {
    let pie = d3
      .pie<Data>()
      .sort(null)
      .value((data) => data.quantity);

    let data_ready = pie(this.data);

    let color = d3
      .scaleOrdinal()
      .domain(
        d3.extent(this.data, (d) => {
          return d.category;
        }) as unknown as string
      )
      .range([this.barColor, '#c9c9c9']);

    const svg = d3
      .select(`#${this.htmlId}`)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    const text = svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('class', 'percentage')
      .style('fill', 'black')
      .style('font-size', '30px')
      .style('font-weight', 'bold');

    text.text(this.data[0].quantity + '%');

    svg
      .selectAll('whatever')
      .data(data_ready)
      .join('path')
      .attr(
        'd',
        d3.arc<PieArcDatum<Data>>().innerRadius(59).outerRadius(43) // This is the size of the donut hole
      )
      .attr('fill', (d) => {
        return color(d.data.category) as string;
      })
      .style('opacity', 0.7);
  }
}
