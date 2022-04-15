import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

// set the dimensions and margins of the graph




export class OverviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // set the dimensions and margins of the graph
    const width = 50,
    height = 50,
    margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#percentage")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

    interface Data {
        quantity: number;
        category: string;
    }

    // Create dummy data
    let testData: Data[] = [
        {
            quantity: 10,
            category: 'a'
        },
        {
            quantity: 20,
            category: 'b'
        },
        {
            quantity: 10,
            category: 'c'
        },
        {
            quantity: 100,
            category: 'd'
        },
        {
            quantity: 500,
            category: 'e'
        }
    ];


//     // set the color scale
//     const color = d3.scaleOrdinal()
//   .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])
    
//   let pie = d3.pie<Data>().value((d: Data):number => d.quantity);


//     const data_ready = pie(Object.entries(data))
     
//     svg
//   .selectAll('whatever')
//   .data(data_ready)
//   .join('path')
//   .attr('d', d3.arc<d3.Arc<Data>().innerRadius(100).outerRadius(radius)
//   )
//   .attr('fill', d => color(d.data[0]))
//   .attr("stroke", "black")
//   .style("stroke-width", "2px")
//   .style("opacity", 0.7)

//   }
  }
}
