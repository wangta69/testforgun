import { Component, OnInit, HostListener, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart',
    template: `<div class='d3-chart' #chart style='width: 700px; height: 700px; display: block;'></div>`,
//    encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit {
    @ViewChild('chart', {static: true}) private chartContainer: ElementRef;
    private MAX_LENGTH = 100;
    private _data = [];
    private duration = 500;

    private element: any;
    private svg: any;

    private width: number;
    private height: number;

    private axisX: any;
    private axisY: any;
    private lineChart: any;

    ngOnInit() {
        this.seedData();
    }

    private seedData(): void {
        const now = new Date();
        for (let i = 0; i < this.MAX_LENGTH; ++i) {
            this._data.push({
                time: new Date(now.getTime() - ((this.MAX_LENGTH - i) * this.duration)),
                close: this.randomNumberBounds(0, 5)
            });
        }
        console.log(this._data);
        this.init();
    }
    private randomNumberBounds(min: number, max: number): number {
        return Math.floor(Math.random() * max) + min;
    }

    private init() {
        const flag = this.chartContainer.nativeElement.offsetHeight;
        this.element = this.chartContainer.nativeElement;
        // console.log(this.chartContainer.nativeElement);
        if (flag) {
            this.setSvg();
            this.draw(this._data);

            setInterval(() => {
                this.adddata();
            }, 500);
    //        this.svgLoaded = true;
        } else {
            setTimeout(() => {
                this.init();
            }, 100);
        }

    }

    private adddata() {
        console.log(this._data);
        this._data.push({
            time: new Date().getTime(),
            close: this.randomNumberBounds(0, 5)
        });

        if (this._data.length > this.MAX_LENGTH) {
            this._data.shift();
        }

        this.draw(this._data);
    }

    private setSvg(): void {
        const twidth = this.chartContainer.nativeElement.offsetWidth;
        const theight = this.chartContainer.nativeElement.offsetHeight;
        const margin = {top: 20, right : 50, bottom: 20, left: 2};

        this.svg = d3.select(this.element).append('svg');
        this.svg.attr('width', twidth).attr('height', theight);

        this.width = +this.svg.attr('width') - margin.left - margin.right;
        this.height = +this.svg.attr('height') - margin.top - margin.bottom;

        const g = this.svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // x 축 설정
        this.axisX = g.append('g')
            .attr('class', 'axis x')
            .attr('transform', 'translate(0,' + (this.height) + ')');

        this.axisY = g.append('g') // y축에 대한 그룹 엘리먼트 설정
            .attr('class', 'axis y')
            .attr('transform', 'translate(' + (this.width - 30 ) + ', 0)'); // 살짝 오른쪽으로 밀고
            // .attr('transform', 'translate(30, 0)'); // 살짝 오른쪽으로 밀고
            // .call(d3.axisRight(y).ticks(0.1)); // 상기 정의된 y축 입력

        // 라인그래프 출력
        this.lineChart = g.append('g')
            .attr('clip-path', 'url(#clip-line-chart)')
            .attr('class', 'line-chart')
            .append('path') // path: 실제 데이터 구현 부
        //    .datum(data)
            .attr('class', 'line') // (CSS)
        //    .transition()
        //    .duration(duration)
        //    .attr('stroke', 'steelblue')
            .attr('stroke-width', 3)
            .attr('stroke-linejoin', 'round')
            .attr('fill', 'none')
            .attr('stroke-linecap', 'round')
            .attr('stroke-dashoffset', 0);

        const lineClipPath = g.append('defs')
            .append('clipPath')
            .attr('id', 'clip-line-chart')
            .append('rect')
            .attr('width', this.width)
            .attr('height', this.height)
            ;
            // .ease(d3.easeLinear)
        //    .on('start', tick);
    }


    /**
     * @param Array data [{time, close}]
     */
    private draw(data: any): void {

        const minX = new Date(d3.min(data, (d: any) => d.time));
        // const maxX = new Date(d3.max(data, (d: any) => d.time));
        const now =  new Date();
        const maxX = new Date(now.getTime() + 60000 );
        const t = d3.transition().duration(this.duration).ease(d3.easeLinear);

        const xScale = d3.scaleTime() // 시간속성(scale Time) 사용. 그래프의 width에 맞추어 x축을 (n-2 = 0~241)로 나눈다.
            // .domain([now - (n - 2) * duration, now - duration])
            .domain([
                minX, // 2분 데이타를 해야 함으로 현재 1분 데이타의 max +
                maxX  // 2분 데이타를 해야 함으로 현재 1분 데이타의 max + 60000 를 더 추가한다.
            ])
            .range([0, this.width]);

        this.axisX
            .transition(t)
            .call(
                d3.axisBottom(xScale)
            //    .tickSize(-this.height)
            ); // 상기 정의된 x 입력

        const minY = +d3.min(data, (d: any) => d.close);
        const maxY = +d3.max(data, (d: any) => d.close);

        const yScale = d3.scaleLinear() // 그래프의 height에 맞추어 y축을 -1~1로 나눈다.
            .domain([minY, maxY])
            .range([this.height, 0]);

        // y 축 설정
        this.axisY
        //    .transition(t) // Y축 설정, transition화
            .call(
                d3.axisRight(yScale)
                // .ticks(10)
                //  .tickFormat()
                // .tickSize(-this.width)
            ); // 상기 정의된 y축 입력

        const line = d3.line()
            .x((d: any) => xScale(d.time))
            .y((d: any) => yScale(d.close));

        this.lineChart
            .datum(data)
        //    .transition(t)
            .attr('stroke', '#11dca7')
            .attr('d', line);
        //    .transition(t)
        //    .attr('class', this.gameStatus)
        //    .on('start', tick);
        // if (this.gameStatus === 'bet') {
        //     this.lineChart.attr('stroke', '#11dca7');
        // } else if (this.gameStatus === 'wait') {
        //     this.lineChart.attr('stroke', '#e7b821');
        // }
    }
}
