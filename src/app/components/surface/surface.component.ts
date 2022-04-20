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

  data = [
    {
        "year": "2015", 
        "values": [
            {
                "surface": "clay", 
                "playingPercentage": 30
            }, 
            {
              "surface": "hard", 
              "playingPercentage": 30
            }, 
            {
              "surface": "grass", 
              "playingPercentage": 40
            }
        ]
    },
    {
      "year": "2016", 
      "values": [
          {
              "surface": "clay", 
              "playingPercentage": 15
          }, 
          {
            "surface": "hard", 
            "playingPercentage": 30
          }, 
          {
            "surface": "grass", 
            "playingPercentage": 55
          }
      ]
    },
    {
      "year": "2017", 
      "values": [
          {
              "surface": "clay", 
              "playingPercentage": 31
          }, 
          {
            "surface": "hard", 
            "playingPercentage": 29
          }, 
          {
            "surface": "grass", 
            "playingPercentage": 40
          }
      ]
    },
    {
      "year": "2018", 
      "values": [
          {
              "surface": "clay", 
              "playingPercentage": 37
          }, 
          {
            "surface": "hard", 
            "playingPercentage": 12
          }, 
          {
            "surface": "grass", 
            "playingPercentage": 51
          }
      ]
    },
    {
      "year": "2019", 
      "values": [
          {
              "surface": "clay", 
              "playingPercentage": 15
          }, 
          {
            "surface": "hard", 
            "playingPercentage": 30
          }, 
          {
            "surface": "grass", 
            "playingPercentage": 55
          }
      ]
    }
  ]
  

  constructor() { }

  ngOnInit(): void {
    this.draw();
  }

  draw(): void {
    var color = d3.scaleOrdinal()
    .range(["#fe8320","#3d86f0","#6de170"]);

    var margin = { top: 10, right: 10, bottom: 15, left: 30 },
        width = 700 - margin.left - margin.right,
        height = 396 - margin.top - margin.bottom;


    //Create chart svg
    var svg = d3.select("#surface-container").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Create bar chart axis
    var years = this.data.map(d => d.year);
    var rateNames = this.data[0].values.map(d => d.surface);

    //Add X axis
    var x0 = d3
      .scaleBand()
      .range([0, width])
      .domain(years)
      // @ts-ignore
      .padding([0.5]);

    var xAxis = d3.axisBottom(x0).tickSize(0);

    //Add Y axis
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 100]);

    var yAxis = d3.axisLeft(y);

    //Add scale for subgroups
    var x1 = d3.scaleBand()
      .domain(rateNames)
      .range([0, x0.bandwidth()])
    
    //Draw XY
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style('font-weight','bold')
        .style('fill', 'black')
      .text("Playing percentage");

    svg.selectAll("text").style('fill', 'black')



    //Slice
    svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    var slice = svg.selectAll(".slice")
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
        .attr("height", function(d) { return height - y(0); });

    slice.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      // @ts-ignore
      .attr("y", function(d) { return y(d.playingPercentage); })
      // @ts-ignore
      .attr("height", function(d) { return height - y(d.playingPercentage); });;


    //Legend
    var legend = svg.selectAll(".legend")
      .data(this.data[0].values.map(function(d) { return d.surface; }).reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity","0");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        // @ts-ignore
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style('fill', 'black')
        .text(function(d) {return d; });

    legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
  }
}
