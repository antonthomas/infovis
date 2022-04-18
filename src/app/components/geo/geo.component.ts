import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

@Component({
  selector: 'app-geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss']
})
export class GeoComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('assets/data/all_matches.csv', { responseType: 'text' }).subscribe(data => {
      var objs = d3.csvParse(data);
      console.log(data)
      this.drawMap(objs);
    });
    // this.drawMap()
  }

  drawMap(csvData: any) {
    console.log(csvData)
    csvData.forEach((row: any) => {
      console.log('oi')
    });

    // SVG
    const svg = d3.select('#svg-geo')
    const width = parseInt(svg.style('width'))
    const height = parseInt(svg.style('height'))

    // Map and projection
    const path = d3.geoPath()
    const projection = d3.geoMercator()
      .scale(70)
      .center([0, 20])
      .translate([width / 2, height / 2])

    // Data and color scale
    let data: MyMap = new Map()
    const colorScale = d3.scaleThreshold<number, string>()
      .domain([0.2, 0.4, 0.6, 0.8, 1.0])
      .range(d3.schemeBlues[6])

    // Load external data and boot
    Promise.all([
      d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      //@ts-ignore
      // d3.csv('src/assets/data/all_matches.csv', (d: any) => {
      //   if (d.player_id == 'adrian-partl') {
      //     data.set(d.location, 1)
      //   }
      // })
    ]).then(function (loadData) {

      csvData.forEach((row: any) => {
        if (row.player_id == 'adrian-partl') {
          data.set(row.location, 1)
        }
      });

      let topo: any = loadData[0]

      // Draw map
      svg.append('g')
        .selectAll('path')
        .data(topo.features)
        .join('path')
        //@ts-ignore
        .attr('d', d3.geoPath().projection(projection))
        .attr('fill', (d: any) => {
          d.total = data.get(d.id) || 0
          return colorScale(d.total)
        })
    })
  }

}

class MyMap extends Map<string | number, string | number> { }
