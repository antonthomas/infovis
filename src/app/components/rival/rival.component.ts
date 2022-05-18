import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import { SearchService } from 'src/app/services/search/search.service';
import { Player, OpponentGame } from '../../.././types';
import { map, Observable, startWith } from 'rxjs';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-rival',
  templateUrl: './rival.component.html',
  styleUrls: ['./rival.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RivalComponent implements AfterViewInit {
  @Input() player: Player = {
    name: '',
    id: '',
    countryCode: '',
    gamesPlayed: 0,
    gamesWon: 0,
    tournamentsPlayed: 0,
    averageWinningOdd: 0.0,
    averageLosingOdd: 0.0,
    lastFiveGamesOdds: [],
  };

  @Input() opponent: Player = {
    name: '',
    id: '',
    countryCode: '',
    gamesPlayed: 0,
    gamesWon: 0,
    tournamentsPlayed: 0,
    averageWinningOdd: 0.0,
    averageLosingOdd: 0.0,
    lastFiveGamesOdds: [],
  };
  lastFiveGames: ('W' | 'L' | 'NA')[] = [];

  progressbarHeight: number = 30;
  progressbarData: number[] = [];
  progressbarTextData: number[] = [];
  chart!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

  playerControl = new FormControl();
  opponentControl = new FormControl();
  options: string[] = [];
  filteredOptionsPlayer: Observable<string[]> | undefined;
  filteredOptionsOpponent: Observable<string[]> | undefined;

  // @ts-ignore
  game: OpponentGame = null;

  @ViewChild('rivalContainer')
  rivalContainer!: ElementRef;

  constructor(
    private search: SearchService,
    private colorService: ColorService
  ) {}

  ngAfterViewInit(): void {
    this.options = this.search.getPlayerNames();
    this.playerControl.setValue(this.player.name);
    this.opponentControl.setValue(this.opponent.name);

    this.filteredOptionsPlayer = this.playerControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.filteredOptionsOpponent = this.opponentControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.search.getPlayer().subscribe((_) => {
      this.updateData();
      this.updateView();
    });

    this.search.getOpponent().subscribe((_) => {
      this.updateData();
      this.updateView();
    });

    this.updateData();
    this.drawChart();
    this.updateView();
  }

  createSvg(): void {
    this.chart = d3
      .select('#rival-container')
      .append('svg') // creating the svg object inside the container div
      .attr('class', 'chart')
      .attr('width', '100%')
      .attr('height', this.progressbarHeight);
  }

  createBars(): void {
    this.chart
      .selectAll('rect')
      .data(this.progressbarData)
      .enter()
      .append('rect')
      .attr('color', '#fff')
      .attr('stroke', '#fff')
      .attr('fill', this.colorService.NAColor())
      .attr('class', 'progressbar-bar')
      .attr(
        'width',
        d3Scale.scaleLinear([0, '100%']).domain([0, this.progressbarData[0]])
      )
      .attr('height', this.progressbarHeight);
  }

  createText(): void {
    const text1 = this.chart
      .selectAll('text:first-of-type')
      .data([this.progressbarTextData[0]])
      .enter();

    const text2 = this.chart
      .selectAll('text:nth-of-type(2)')
      .data([this.progressbarTextData[1]])
      .enter();

    text1
      .append('text')
      .attr('id', 'progressbar-text-1')
      .attr('x', '30')
      .attr('y', this.progressbarHeight / 2) // y position of the text inside bar
      .attr('font-weight', 'bold')
      .attr('dx', -3) // padding-right
      .attr('dy', '.35em') // vertical-align: middle
      .attr('text-anchor', 'end') // text-align: right
      .text((x) => x + '%');

    text2
      .append('text')
      .attr('id', 'progressbar-text-2')
      .attr('x', '100%')
      .attr('y', this.progressbarHeight / 2) // y position of the text inside bar
      .attr('font-weight', 'bold')
      .attr('dx', -3) // padding-right
      .attr('dy', '.35em') // vertical-align: middle
      .attr('text-anchor', 'end') // text-align: right
      .text((x) => x + '%');
  }

  drawChart(): void {
    this.createSvg();
    this.createBars();
    this.createText();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  updatePlayer(event: any) {
    this.search.setPlayer(event.option.value);
  }

  updateOpponent(event: any) {
    this.search.setOpponent(event.option.value);
  }

  updateData() {
    const game = this.search.filterRival(this.player.id, this.opponent.id);

    if (game.matchesPlayed === 0) {
      this.progressbarTextData = [0, 0];
    } else {
      this.progressbarData = [game.matchesPlayed, game.matchesWon];
      let winPercentagePlayer = Math.round(
        (game.matchesWon / game.matchesPlayed) * 100
      );
      this.progressbarTextData = [
        winPercentagePlayer,
        100 - winPercentagePlayer,
      ];
    }

    if (game.lastFive.length < 5) {
      // const remaining = 5 - game.lastFive.length;
      this.lastFiveGames = game.lastFive.map((g) => {
        if (g.won === true) return 'W';
        else return 'L';
      });
      // for (let i = 0; i < remaining; i++) {
      //   this.lastFiveGames.push('NA');
      // }
      // console.log(this.lastFiveGames);
    } else {
      this.lastFiveGames = game.lastFive.map((g) => {
        if (g.won === true) return 'W';
        else return 'L';
      });
    }

    this.game = game;
  }

  updateView() {
    this.updateProgessbarView();
  }

  updateProgessbarView() {
    d3.select('#progressbar-text-1').text(this.progressbarTextData[0] + '%');
    d3.select('#progressbar-text-2').text(this.progressbarTextData[1] + '%');

    const barPlayer = d3.select('.progressbar-bar:nth-of-type(2)');
    const barOpponent = d3.select('.progressbar-bar:nth-of-type(1)');

    if (this.game.matchesPlayed === 0) {
      barPlayer
        .transition()
        .duration(800)
        .attr('fill', this.colorService.NAColor())
        .attr('width', this.progressbarTextData[0] + '%');
      barOpponent
        .transition()
        .duration(800)
        .attr('fill', this.colorService.NAColor())
        .attr('width', '100%');
    } else {
      barPlayer
        .transition()
        .duration(800)
        .attr('fill', this.colorService.playerColor())
        .attr('width', this.progressbarTextData[0] + '%');
      barOpponent
        .transition()
        .duration(800)
        .attr('fill', this.colorService.opponentColor())
        .attr('width', '100%');
    }
  }

  clear(player: boolean) {
    if (player) {
      this.playerControl.setValue('');
    } else {
      this.opponentControl.setValue('');
    }
  }
}
