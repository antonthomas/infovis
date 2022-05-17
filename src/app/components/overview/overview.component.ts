import {AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,} from '@angular/core';
import * as d3 from 'd3';
import { pie, PieArcDatum } from 'd3';
import { Player } from '../../.././types';
import { SearchService } from 'src/app/services/search/search.service';

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
export class OverviewComponent implements AfterViewInit  {
  @Input() player: Player = { name: '', id: '', countryCode: '', gamesPlayed: 0, gamesWon: 0, tournamentsPlayed: 0, averageWinningOdd: 0.0, averageLosingOdd: 0.0 };
  @Input() isOpponent: boolean = false;
  @Input() barColor = '';

  //initial dimensions
  width = 120;
  height = 120;
  margin = 40;
  radius = Math.min(this.width, this.height) / 2 - this.margin;

  svg: any;

  data: Data[] = [
    {
      quantity: 0, //winning percentage
      category: 'a'
    },
    {
      quantity: 0, //remainder (100 - winning %)
      category: 'b'
    }
  ]

  constructor(private _search: SearchService) {}

  ngAfterViewInit(): void {
    if(!this.isOpponent) this.player = this._search.getOpponent().getValue()
    else this.player = this._search.getPlayer().getValue()

    this.drawChart()
  }

  drawChart(): void {
    var winPercentage = Math.round((this.player.gamesWon/this.player.gamesPlayed) * 100)

    this.data = [
      {
        quantity: winPercentage, //winning percentage
        category: 'a'
      },
      {
        quantity: 100 - winPercentage, //remainder (100 - winning %)
        category: 'b'
      }
    ];

    var pie = d3.pie<Data>().sort(null).value((data) => data.quantity)
    var data_ready = pie(this.data)


    var color = d3
      .scaleOrdinal()
      .domain(
        (d3.extent(this.data, (d) => {
          return d.category
        }) as unknown) as string
      )
      .range(["#fe6262", "#c9c9c9"])


    this.svg = d3.select(`#${this.player.id}`)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.width / 2},${this.height / 2})`);

    const text = this.svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("class", "percentage")
      .style("fill", "black")
      .style("font-size", "30px")
      .style("font-weight", "bold");

    text.text(this.data[0].quantity + "%")

    this.svg.selectAll('whatever')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc<PieArcDatum<Data>>()
        .innerRadius(59)
        .outerRadius(43)
      )
      //@ts-ignore
      .attr('fill', d => { return color(d.data.category) as string })
      .style("opacity", 0.7)
  }
}
