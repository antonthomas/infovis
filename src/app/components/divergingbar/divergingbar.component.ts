// @ts-nocheck
import {
  AfterViewInit,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import * as d3 from 'd3';
import { ColorService } from 'src/app/services/color.service';
import { SearchService } from 'src/app/services/search/search.service';

let playerColor = '';
let opponentColor = '';

@Component({
  selector: 'app-divergingbar',
  templateUrl: './divergingbar.component.html',
  styleUrls: ['./divergingbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DivergingbarComponent implements AfterViewInit {
  player: Player = null;
  opponent: Player = null;

  constructor(
    private colorService: ColorService,
    private search: SearchService
  ) {
    playerColor = this.colorService.playerColor();
    opponentColor = this.colorService.opponentColor();

    search.getPlayer().subscribe((p) => {
      this.player = p;
      this.updateData();
      this.updateView();
    });
    search.getOpponent().subscribe((o) => {
      this.opponent = o;
      this.updateData();
      this.updateView();
    });
  }

  data = [
    {
      player: 60,
      opponent: 50,
      average: 90,
      playerLast5: 55,
      OpponentLast5: 90,
      metric: '1st serve',
      info: 'This means how good the player ',
    },
    {
      player: 60,
      opponent: 60,
      average: 50,
      playerLast5: 55,
      OpponentLast5: 45,
      metric: '2nd serve',
      info: 'This means how good the player ',
    },
    {
      player: 60,
      opponent: 70,
      average: 50,
      playerLast5: 30,
      OpponentLast5: 45,
      metric: 'Tie break win',
      info: 'This means how good the player ',
    },
    {
      player: 30,
      opponent: 30,
      average: 50,
      playerLast5: 30,
      OpponentLast5: 45,
      metric: 'Service games win',
      info: 'This means how good the player ',
    },
    {
      player: 30,
      opponent: 30,
      average: 50,
      playerLast5: 30,
      OpponentLast5: 45,
      metric: 'Return games win',
      info: 'This means how good the player ',
    },
    {
      player: 40,
      opponent: 35,
      average: 50,
      playerLast5: 30,
      OpponentLast5: 45,
      metric: 'Double Fault',
      info: 'This means how good the player ',
    },
    {
      player: 80,
      opponent: 50,
      average: 50,
      playerLast5: 30,
      OpponentLast5: 45,
      metric: 'Break point save',
      info: 'This means how good the player ',
    },
    {
      player: 40,
      opponent: 70,
      average: 50,
      playerLast5: 30,
      OpponentLast5: 45,
      metric: 'Break point against',
      info: 'This means how good the player ',
    },
  ];

  chart: any = null;
  @Input() htmlId = '';

  updateData() {
    this.data = this.search.filterPerformance(this.player.id, this.opponent.id);
  }

  updateView() {
    this.chart = DivergingBarChart(this.data, {
      xPlayer: (d) => d.average / d.player - 1,
      xPlayerLast5: (d) => d.average / d.playerLast5 - 1,
      xOpponent: (d) => d.average / d.opponent - 1,
      xOpponentLast5: (d) => d.average / d.OpponentLast5 - 1,
      y: (d) => d.metric,
      info: (d) => d.info,
      yDomain: d3.groupSort(
        this.data,
        ([d]) => d.average - d.player,
        (d) => d.metric
      ),
      xFormat: '+%',
      width: document.querySelector('.performance-stats').offsetWidth - 92,
      height: document.querySelector('.performance-stats').offsetHeight - 88,
      marginRight: 50,
      marginLeft: 50,
    });
    document.querySelector('#diverging').appendChild(this.chart);
  }

  ngAfterViewInit(): void {
    this.updateData();
    this.updateView();
  }
}

function DivergingBarChart(
  data,
  {
    xPlayer = (d) => d, // given d in data, returns the (quantitative) x-value
    xPlayerLast5 = (d) => d,
    xOpponent = (d) => d,
    xOpponentLast5 = (d) => d,
    y = (d, i) => i, // given d in data, returns the (ordinal) y-value
    info = (d) => d,
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 10, // bottom margin, in pixels
    marginLeft = 30, // left margin, in pixels
    width, // outer width of chart, in pixels
    height, // the outer height of the chart, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    xFormat, // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    yPadding = 0.3, // amount of y-range to reserve to separate bars
    yDomain, // an array of (ordinal) y-values
    yRange, // [top, bottom]
  } = {}
) {
  // Compute values.
  const Xplayer = d3.map(data, xPlayer);
  const XplayerLast5 = d3.map(data, xPlayerLast5);

  const Xopponent = d3.map(data, xOpponent);
  const XopponentLast5 = d3.map(data, xOpponentLast5);

  const Yinfo = d3.map(data, info);

  const Y = d3.map(data, y);

  const concatted = Xplayer.concat(XplayerLast5)
    .concat(Xopponent)
    .concat(XopponentLast5);

  // Compute default domains, and unique the y-domain.
  if (xDomain === undefined) xDomain = d3.extent(concatted);
  if (yDomain === undefined) yDomain = Y;
  yDomain = new d3.InternSet(yDomain);

  // Omit any data not present in the y-domain.
  // Lookup the x-value for a given y-value.
  const playerData = d3.range(Xplayer.length).filter((i) => yDomain.has(Y[i]));
  const playerLast5Data = d3
    .range(XplayerLast5.length)
    .filter((i) => yDomain.has(Y[i]));
  const opponentData = d3
    .range(Xopponent.length)
    .filter((i) => yDomain.has(Y[i]));
  const opponentLast5Data = d3
    .range(XopponentLast5.length)
    .filter((i) => yDomain.has(Y[i]));
  const YX = d3.rollup(
    playerData,
    ([i]) => Xplayer[i],
    (i) => Y[i]
  );

  // Compute the default height.
  if (height === undefined)
    height =
      // Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
      document.querySelectorAll('.performance-stats')[0].offsetHeight -
      marginTop -
      marginBottom -
      48;
  if (yRange === undefined) yRange = [marginTop, height - marginBottom];

  // Construct scales, axes, and formats.
  const xScale = xType(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
  const xAxis = d3.axisTop(xScale).ticks(width / 80);
  const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);
  const format = xScale.tickFormat(100, xFormat);

  // Compute titles.
  if (title === undefined) {
    title = (i) => `${Y[i]}\n${format(Xplayer[i])}`;
  } else if (title !== null) {
    const O = d3.map(data, (d) => d);
    const T = title;
    title = (i) => T(O[i], i, data);
  }

  const svg = d3
    .create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  svg
    .append('g')
    .attr('transform', `translate(0,${marginTop})`)
    .call(xAxis)
    .call((g) => g.select('.domain').remove())
    .call((g) =>
      g
        .selectAll('.tick line')
        .clone()
        .attr('y2', height - marginTop - marginBottom)
        .attr('stroke-opacity', 0.1)
    )
    .call((g) =>
      g
        .append('text')
        .attr('x', xScale(0))
        .attr('y', -22)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'center')
        .text(xLabel)
    );

  let tooltip = d3
    .select(`#diverging`)
    .append('div')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('background', '#eee')
    .style('padding', '10px')
    .style('border-radius', '4px');

  const bar = svg
    .append('g')
    .selectAll('rect')
    .data(playerData)
    .join('rect')
    .attr(
      'fill',
      playerColor /*i => colorsPlayer[Xplayer[i] > 0 ? colorsPlayer.length - 1 : 0]*/
    )
    .attr('x', (i) => Math.min(xScale(0), xScale(Xplayer[i])))
    .attr('y', (i) => yScale(Y[i]))
    .attr('width', (i) => Math.abs(xScale(Xplayer[i]) - xScale(0)))
    .attr('height', yScale.bandwidth() / 2)
    .on('mouseover', (e: Event, d: any) => {
      tooltip.text(data[d].info);
      tooltip.style('visibility', 'visible');
    })
    .on('mousemove', (e: Event) => {
      return tooltip
        .style('margin-top', `${d3.pointer(e)[1] - 50}px`)
        .style('left', d3.pointer(e)[0] + 10 + 'px');
    })
    .on('mouseout', () => {
      return tooltip.style('visibility', 'hidden');
    });

  svg
    .append('g')
    .selectAll('rect')
    .data(opponentData)
    .join('rect')
    .attr(
      'fill',
      opponentColor /*i => colorsOpponent[Xopponent[i] > 0 ? colorsPlayer.length - 1 : 0]*/
    )
    .attr('x', (i) => Math.min(xScale(0), xScale(Xopponent[i])))
    .attr('y', (i) => yScale(Y[i]) + yScale.bandwidth() / 2)
    .attr('width', (i) => Math.abs(xScale(Xopponent[i]) - xScale(0)))
    .attr('height', yScale.bandwidth() / 2);

  // Last 5 matches circle (player)
  svg
    .append('g')
    .selectAll('circle')
    .data(playerData)
    .join('circle')
    .attr('fill', '#006bd7')
    .attr('cx', (i) => xScale(XplayerLast5[i]))
    .attr('cy', (i) => yScale(Y[i]) + yScale.bandwidth() / 4)
    .attr('r', yScale.bandwidth() / 4);

  // Last 5 matches circle (opponent)
  svg
    .append('g')
    .selectAll('circle')
    .data(playerData)
    .join('circle')
    .attr('fill', '#c80303')
    .attr('cx', (i) => xScale(XopponentLast5[i]))
    .attr('cy', (i) => yScale(Y[i]) + 0.75 * yScale.bandwidth())
    .attr('r', yScale.bandwidth() / 4);

  if (title) bar.append('title').text(title);

  svg
    .append('g')
    .attr('text-anchor', 'end')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 8)
    .selectAll('text')
    .data(playerData)
    .join('text')
    .attr('class', 'value')
    .attr('text-anchor', (i) => (Xplayer[i] < 0 ? 'end' : 'start'))
    .attr('x', (i) => xScale(Xplayer[i]) + Math.sign(Xplayer[i] - 0) * 4)
    .attr('y', (i) => yScale(Y[i]) + yScale.bandwidth() / 2 - 2)
    // .attr("dy", "0.35em")
    .text((i) => format(Xplayer[i]));

  svg
    .append('g')
    .attr('text-anchor', 'end')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 8)
    .selectAll('text')
    .data(playerData)
    .join('text')
    .attr('text-anchor', (i) => (Xplayer[i] < 0 ? 'end' : 'start'))
    .attr('class', 'value')
    .attr('x', (i) => xScale(Xopponent[i]) + Math.sign(Xplayer[i] - 0) * 4)
    .attr('y', (i) => yScale(Y[i]) + yScale.bandwidth())
    // .attr("dy", "0.35em")
    .text((i) => format(Xopponent[i]));

  svg
    .append('g')
    .attr('transform', `translate(${xScale(0)},0)`)
    .call(yAxis)
    .call((g) =>
      g
        .selectAll('.tick text')
        .filter((y) => YX.get(y) < 0)
        .attr('text-anchor', 'start')
        .attr('x', 6)
    );

  return svg.node();
}
