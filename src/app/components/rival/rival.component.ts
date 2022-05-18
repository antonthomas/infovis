import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
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

/**
 * Necessary data:
 *  - Player 1
 *    -> name
 *    -> nationality + flag
 *  - Player 2
 *    -> name
 *    -> nationality + flag
 *  - Amount of games between p1 & p2 played on surface x
 *    -> Including who won
 *  - Last 5 games between p1 & p2 played on surface x
 *    -> Including who won
 *
 * Tutorials:
 *  - https://bl.ocks.org/sarahob/1e291c95c4169ddabb77bbd10b6a7ef7
 *  - http://bl.ocks.org/nelliemckesson/5315143
 */

type Game = {
  won: boolean;
};

@Component({
  selector: 'app-rival',
  templateUrl: './rival.component.html',
  styleUrls: ['./rival.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RivalComponent implements OnInit {
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

  // player1: Player = {
  //   name: 'Roger Federer',
  //   id: 'roger-federer',
  //   countryCode: 'ch',
  // };
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
  progressbarHeight: number = 30;
  totalGames: number = 100;
  gamesWonPlayer1: number = 60;
  gamesWonPlayer2: number = 40;
  lastFiveGames: Game[] = [
    { won: true },
    { won: false },
    { won: true },
    { won: false },
    { won: true },
  ];

  progressbarData: number[] = [this.totalGames, this.gamesWonPlayer1];
  progressbarTextData: number[] = [0.64, 0.36];
  chart!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

  playerControl = new FormControl();
  opponentControl = new FormControl();
  options: string[] = [];
  filteredOptionsPlayer: Observable<string[]> | undefined;
  filteredOptionsOpponent: Observable<string[]> | undefined;

  @ViewChild('rivalContainer')
  rivalContainer!: ElementRef;

  constructor(private search: SearchService) {
    this.options = this.search.getPlayerNames();
  }

  ngOnInit(): void {
    // const opponentGame = this.search.filterRival(
    //   this.player.id,
    //   this.opponent.id
    // );
    // this.lastFiveGames = opponentGame.lastFive;
    // this.progressbarData = [
    //   opponentGame.matchesPlayed,
    //   opponentGame.matchesWon,
    // ];
    // this.progressbarTextData = [
    //   (opponentGame.matchesWon / opponentGame.matchesPlayed) * 100,
    //   ((opponentGame.matchesPlayed - opponentGame.matchesWon) /
    //     opponentGame.matchesPlayed) *
    //     100,
    // ];

    // console.log(this.progressbarTextData);

    // console.log('Total games', this.progressbarData[0]);
    // console.log('Games won player', this.progressbarData[1]);
    this.updateData();

    this.filteredOptionsPlayer = this.playerControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.filteredOptionsOpponent = this.opponentControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.drawChart();
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
      .attr('x', '30')
      .attr('y', this.progressbarHeight / 2) // y position of the text inside bar
      .attr('font-weight', 'bold')
      .attr('dx', -3) // padding-right
      .attr('dy', '.35em') // vertical-align: middle
      .attr('text-anchor', 'end') // text-align: right
      .text((x) => x + '%');

    text2
      .append('text')
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
    console.log('a', event);
    this.search.setPlayer(event.option.value);
  }

  // TODO: this method is not being called...
  // It does work when commenting out first form field in HTML
  updateOpponent(event: any) {
    console.log('b', event);
    this.search.setOpponent(event.option.value);
  }

  updateData() {
    const game = this.search.filterRival(this.player.id, this.opponent.id);
    this.lastFiveGames = game.lastFive;
    this.progressbarData = [game.matchesPlayed, game.matchesWon];
    const winPercentagePlayer = Math.round(
      (game.matchesWon / game.matchesPlayed) * 100
    );
    this.progressbarTextData = [winPercentagePlayer, 100 - winPercentagePlayer];
    console.log(this.progressbarTextData);
  }
}
