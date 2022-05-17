// @ts-nocheck
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3';
import { Player } from '../../.././types';
import { SearchService } from 'src/app/services/search/search.service';
import { ColorService } from 'src/app/services/color.service';

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
  encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent implements AfterViewInit {
  @Input() player: Player = {
    name: '',
    id: '',
    countryCode: '',
    gamesPlayed: 0,
    gamesWon: 0,
    tournamentsPlayed: 0,
    averageWinningOdd: 0.0,
    averageLosingOdd: 0.0,
    lastFiveGamesOdds: []
  };
  @Input() isOpponent: boolean = false;
  @Input() barColor = '';

  //initial dimensions
  width = 120;
  height = 120;
  margin = 40;
  radius = Math.min(this.width, this.height) / 2 - this.margin;

  pie: any;
  path: any;
  _current: any;

  svg: any;

  data: Data[] = [
    {
      quantity: 0, //winning percentage
      category: 'a',
    },
    {
      quantity: 0, //remainder (100 - winning %)
      category: 'b',
    },
  ];

  constructor(
    private _search: SearchService,
    private colorService: ColorService
  ) {
    _search.getPlayer().subscribe((p) => {
      if (!this.isOpponent) {
        this.updateData();
        this.updateChart();
      }
    });
    _search.getOpponent().subscribe((p) => {
      if (this.isOpponent) {
        this.updateData();
        this.updateChart();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isOpponent) this.player = this._search.getOpponent().getValue();
    else this.player = this._search.getPlayer().getValue();

    this.updateData();
    this.drawChart();
  }

  updateData(): void {
    const winPercentage = Math.round(
      (this.player.gamesWon / this.player.gamesPlayed) * 100
    );

    this.data = [
      {
        quantity: winPercentage, //winning percentage
        category: 'a',
      },
      {
        quantity: 100 - winPercentage, //remainder (100 - winning %)
        category: 'b',
      },
    ];
  }

  updateChart(): void {
    const pie = d3
      .pie<Data>()
      .value(function (d) {
        return d.quantity;
      })
      .sort(null)(this.data);

    // const donutId = this.isOpponent ? '#opponentDonut' : '#playerDonut';
    const path = d3.select(`#${this.player.id}`).selectAll('path').data(pie);
    const arc = d3.arc<PieArcDatum<Data>>().innerRadius(59).outerRadius(43);

    path.transition().duration(800).attr('d', arc);

    const id = !this.isOpponent ? '#opponentText' : '#playerText';
    const text = d3.select(id);
    console.log(text);
    text.text(this.data[0].quantity + '%');
    console.log(this.data[0].quantity);
  }

  drawChart(): void {
    this.pie = d3
      .pie<Data>()
      .sort(null)
      .value((data) => data.quantity);
    var data_ready = this.pie(this.data);

    var color = d3
      .scaleOrdinal()
      .domain(
        d3.extent(this.data, (d) => {
          return d.category;
        }) as unknown as string
      )
      .range([this.primaryColor(), '#c9c9c9']);

    this.svg = d3
      .select(`#${this.player.id}`)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    const id = this.isOpponent ? 'opponentText' : 'playerText';
    const text = this.svg
      .append('text')
      .attr('id', id)
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('class', 'percentage')
      .style('fill', 'black')
      .style('font-size', '30px')
      .style('font-weight', 'bold');

    text.text(this.data[0].quantity + '%');

    this.svg
      .selectAll('whatever')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc<PieArcDatum<Data>>().innerRadius(59).outerRadius(43))
      //@ts-ignore
      .attr('fill', (d) => {
        return color(d.data.category) as string;
      })
      .style('opacity', 0.7);
  }

  primaryColor(): string {
    if (!this.isOpponent) return this.colorService.opponentColor();
    else return this.colorService.playerColor();
  }

  arcTween(a): any {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
      return arc(i(t));
    };
  }
}
