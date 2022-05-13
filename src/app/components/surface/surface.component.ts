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
import { color } from 'd3';

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

  data = [
    {
        "year": "2015", 
        "values": [
            {
                "surface": "clay", 
                "p1WinPercentage": 58,
                "p2WinPercentage": 65
            }, 
            {
              "surface": "hard", 
              "p1WinPercentage": 34,
              "p2WinPercentage": 49
            }, 
            {
              "surface": "grass", 
              "p1WinPercentage": 65,
              "p2WinPercentage": 68
            }
        ]
    },
    {
      "year": "2016",
      "values": [
          {
              "surface": "clay", 
              "p1WinPercentage": 61,
              "p2WinPercentage": 65
          }, 
          {
            "surface": "hard", 
            "p1WinPercentage": 68,
            "p2WinPercentage": 69
          }, 
          {
            "surface": "grass", 
            "p1WinPercentage": 41,
            "p2WinPercentage": 48
          }
      ]
    },
    {
      "year": "2017",
      "values": [
          {
              "surface": "clay", 
              "p1WinPercentage": 34,
              "p2WinPercentage": 51
          }, 
          {
            "surface": "hard", 
            "p1WinPercentage": 39,
            "p2WinPercentage": 49
          }, 
          {
            "surface": "grass", 
            "p1WinPercentage": 47,
            "p2WinPercentage": 59
          }
      ]
    },
    {
      "year": "2018",
      "values": [
          {
              "surface": "clay", 
              "p1WinPercentage": 37,
              "p2WinPercentage": 34
          }, 
          {
            "surface": "hard", 
            "p1WinPercentage": 22,
            "p2WinPercentage": 38
          }, 
          {
            "surface": "grass", 
            "p1WinPercentage": 51,
            "p2WinPercentage": 47
          }
      ]
    },
    {
      "year": "2019",
      "values": [
          {
              "surface": "clay", 
              "p1WinPercentage": 37,
              "p2WinPercentage": 43
          }, 
          {
            "surface": "hard", 
            "p1WinPercentage": 30,
            "p2WinPercentage": 58
          }, 
          {
            "surface": "grass", 
            "p1WinPercentage": 55,
            "p2WinPercentage": 65
          }
      ]
    }
  ]


  color = d3.scaleOrdinal()
    .range(["#fe8320","#3d86f0","#6de170"]);

  marginTop = 10
  marginLeft = 10
  marginRight = 10
  marginBottom = 10  
  width: number = 700 - this.marginLeft - this.marginRight
  height: number = 396 - this.marginTop - this.marginBottom;


  //Create chart svg
  svg = d3.select("#surface-container").append("svg")
  .attr("width", this.width + this.marginLeft + this.marginRight)
  .attr("height", this.height + this.marginTop + this.marginBottom)
  .append("g")
  .attr("transform", "translate(" + this.marginLeft + "," +this.marginTop + ")");

  constructor() { }

  ngOnInit(): void {
    this.drawbarChart();
  }

  drawLineChart(): void {
    this.svg.selectAll(".line")
    .data(this.data)
    .enter()
    .append("path")
      .attr("fill", "none")
      // @ts-ignore
      .attr("stroke", function(d){ return color(d.surface) })
      .attr("stroke-width", 1.5)
      .attr("d", function(d){
        return d3.line()
          // @ts-ignore
          .x(function(d) { return x(d.year); })
          // @ts-ignore
          .y(function(d) { return y(d.values.p1WinPercentage); })
          // @ts-ignore
          (d.values)
      })
  }

  drawbarChart(): void {
    
    var color = d3.scaleOrdinal()
      .range(["#fe8320", "#3d86f0", "#6de170"]);

    //Create bar chart axis
    var years = this.data.map(d => d.year);
    var surfaceNames = this.data[0].values.map(d => d.surface);

    //Add X axis
    var x0 = d3
      .scaleBand()
      .range([0, this.width])
      .domain(years)
      // @ts-ignore
      .padding([0.5]);

    var xAxis = d3.axisBottom(x0).tickSize(0);

    //Add Y axis
    var y = d3.scaleLinear()
        .range([this.height, 0])
        .domain([0, 100]);

    var yAxis = d3.axisLeft(y);

    //Add scale for subgroups
    var x1 = d3.scaleBand()
      .domain(surfaceNames)
      .range([0, x0.bandwidth()])

    //Draw XY
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(xAxis);

    this.svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style('font-weight','bold')
        .style('fill', 'black')
      .text("Playing percentage");

    this.svg.selectAll("text").style('fill', 'black')



    //Slice
    this.svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    var slice = this.svg.selectAll(".slice")
        .data(this.data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform",function(d) { return "translate(" + x0(d.year) + ",0)"; });

    slice.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .attr("width", 20)
        // @ts-ignore
        .attr("x", function(d) { return x1(d.surface); })
        // @ts-ignore
        .style("fill", function(d) { return color(d.surface) })
        .style("margin-left", 15)
        .attr("y", function(d) { return y(0); })
        // @ts-ignore
        .attr("height", function(d) { return this.height - y(0); });

    slice.selectAll("rect")
      .transition()
      .delay(function (d) { return Math.random() * 1000; })
      .duration(1000)
      // @ts-ignore
      .attr("y", function (d) { return y(d.playingPercentage); })
      // @ts-ignore
      .attr("height", function (d) { return height - y(d.playingPercentage); });;


    //Legend
    var legend = this.svg.selectAll(".legend")
      .data(this.data[0].values.map(function(d) { return d.surface; }).reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity", "0");

    legend.append("rect")
        .attr("x", this.width - 18)
        .attr("width", 18)
        .attr("height", 18)
        // @ts-ignore
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", this.width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style('fill', 'black')
        .text(function(d) {return d; });

    legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
  }
}
