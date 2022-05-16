// @ts-nocheck
import {
  AfterViewInit,
  Component,
  Input,
  ViewEncapsulation
} from "@angular/core";

import * as d3 from 'd3';

@Component({
  selector: "app-divergingbar",
  templateUrl: "./divergingbar.component.html",
  styleUrls: ["./divergingbar.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class DivergingbarComponent implements AfterViewInit {
  data = [
    { player: 60, opponent: 50, average: 90, metric: "1st serve" },
    { player: 60, opponent: 60, average: 50, metric: "2nd serve" },
    { player: 60, opponent: 70, average: 50, metric: "Tie break win" },
    { player: 30, opponent: 30, average: 50, metric: "Service games win" },
    { player: 30, opponent: 30, average: 50, metric: "Return games win" },
    { player: 40, opponent: 35, average: 50, metric: "Double Fault" },
    { player: 80, opponent: 50, average: 50, metric: "Break point save" },
    { player: 40, opponent: 70, average: 50, metric: "Break point against" }]

  chart: any = null
  @Input() htmlId = '';

  ngAfterViewInit(): void {
    this.chart = DivergingBarChart(this.data, {
      xPlayer: d => d.average / d.player - 1,
      xOpponent: d => d.average / d.opponent - 1,
      y: d => d.metric,
      yDomain: d3.groupSort(this.data, ([d]) => d.average - d.player, d => d.metric),
      xFormat: "+%",
      // xLabel: "← performance metrics →",
      width: document.querySelector('.performance-stats').offsetWidth,
      height: document.querySelector('.performance-stats').offsetHeight,
      marginRight: 50,
      marginLeft: 50,
    })
    document.querySelector("#diverging").appendChild(this.chart)
  }

}

function DivergingBarChart(data, {
  xPlayer = d => d, // given d in data, returns the (quantitative) x-value
  xOpponent = d => d,
  y = (d, i) => i, // given d in data, returns the (ordinal) y-value
  title, // given d in data, returns the title text
  marginTop = 30, // top margin, in pixels
  marginRight = 40, // right margin, in pixels
  marginBottom = 10, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
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
} = {}) {
  // Compute values.
  const Xplayer = d3.map(data, xPlayer);
  const Xopponent = d3.map(data, xOpponent);

  const Y = d3.map(data, y);

  // Compute default domains, and unique the y-domain.
  if (xDomain === undefined) xDomain = d3.extent(Xplayer);
  if (yDomain === undefined) yDomain = Y;
  yDomain = new d3.InternSet(yDomain);

  // Omit any data not present in the y-domain.
  // Lookup the x-value for a given y-value.
  const playerData = d3.range(Xplayer.length).filter(i => yDomain.has(Y[i]));
  const opponentData = d3.range(Xopponent.length).filter(i => yDomain.has(Y[i]));
  const YX = d3.rollup(playerData, ([i]) => Xplayer[i], i => Y[i]);

  // Compute the default height.
  if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
  if (yRange === undefined) yRange = [marginTop, height - marginBottom];

  // Construct scales, axes, and formats.
  const xScale = xType(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
  const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
  const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);
  const format = xScale.tickFormat(100, xFormat);

  // Compute titles.
  if (title === undefined) {
    title = i => `${Y[i]}\n${format(Xplayer[i])}`;
  } else if (title !== null) {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
    .attr("transform", `translate(0,${marginTop})`)
    .call(xAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("y2", height - marginTop - marginBottom)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", xScale(0))
      .attr("y", -22)
      .attr("fill", "currentColor")
      .attr("text-anchor", "center")
      .text(xLabel));

  const bar = svg.append("g")
    .selectAll("rect")
    .data(playerData)
    .join("rect")
    .attr("fill", "#6dadee" /*i => colorsPlayer[Xplayer[i] > 0 ? colorsPlayer.length - 1 : 0]*/)
    .attr("x", i => Math.min(xScale(0), xScale(Xplayer[i])))
    .attr("y", i => yScale(Y[i]))
    .attr("width", i => Math.abs(xScale(Xplayer[i]) - xScale(0)))
    .attr("height", yScale.bandwidth() / 2);

  const bar2 = svg.append("g")
    .selectAll("rect")
    .data(opponentData)
    .join("rect")
    .attr("fill", "#ea6f59" /*i => colorsOpponent[Xopponent[i] > 0 ? colorsPlayer.length - 1 : 0]*/)
    .attr("x", i => Math.min(xScale(0), xScale(Xopponent[i])))
    .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
    .attr("width", i => Math.abs(xScale(Xopponent[i]) - xScale(0)))
    .attr("height", yScale.bandwidth() / 2);

  if (title) bar.append("title")
    .text(title);

  svg.append("g")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", 8)
    .selectAll("text")
    .data(playerData)
    .join("text")
    .attr("class", "value")
    .attr("text-anchor", i => Xplayer[i] < 0 ? "end" : "start")
    .attr("x", i => xScale(Xplayer[i]) + Math.sign(Xplayer[i] - 0) * 4)
    .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2 - 2)
    // .attr("dy", "0.35em")
    .text(i => format(Xplayer[i]));

  svg.append("g")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", 8)
    .selectAll("text")
    .data(playerData)
    .join("text")
    .attr("text-anchor", i => Xplayer[i] < 0 ? "end" : "start")
    .attr("class", "value")
    .attr("x", i => xScale(Xopponent[i]) + Math.sign(Xplayer[i] - 0) * 4)
    .attr("y", i => yScale(Y[i]) + yScale.bandwidth())
    // .attr("dy", "0.35em")
    .text(i => format(Xopponent[i]));

  svg.append("g")
    .attr("transform", `translate(${xScale(0)},0)`)
    .call(yAxis)
    .call(g => g.selectAll(".tick text")
      .filter(y => YX.get(y) < 0)
      .attr("text-anchor", "start")
      .attr("x", 6));

  return svg.node();
}
