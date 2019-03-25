import {Directive, Input, OnChanges} from '@angular/core';
import * as d3 from 'd3';
import {FixationPoint} from './classes/FixationPoint';

@Directive({
  selector: '[appGazeStripes]'
})
export class GazeStripesDirective implements OnChanges {
  @Input() userFixationData;
  @Input() user: string;
  @Input() imageUrl; string;
  @Input() imageWidth: number;
  @Input() imageHeight: number;
  @Input() scaleValue: number;

  constructor() { }

  ngOnChanges() {
    const container = d3.select('#gaze-stripe-' + this.user);
    const width = this.scaleValue;
    const height = this.scaleValue;

    // reset svg
    container.selectAll('*').remove();

    if (this.userFixationData === undefined) {
      return;
    }

    this.generateGazeStripesForUser(this.user, this.userFixationData[this.user], container, width, height);

  }

  private generateGazeStripesForUser(user: string, fixationData: FixationPoint[], container, width: number, height: number) {

    if (fixationData === undefined || fixationData.length <= 0) { return; }

    // remove scroll-bar
    d3.selectAll('.drag-scroll-content').style('overflow', 'hidden');

    // create svg
    container.append('svg')
      .attr('id', 'user_' + user)
      .attr('width', width * fixationData.length)
      .attr('height', height + height / 2 + 10);

    const svg = d3.select('#user_' + user);

    // create note data from thumbnail data
    const nodeData = [];

    for (let i = 0; i < fixationData.length; i++) {
      const fixation = fixationData[i];
      nodeData.push({
        'name': i, 'shiftX': fixation.getX(), 'shiftY': fixation.getY()
      });
    }

    // create pattern for each thumbnail
    const defs = svg.append('defs')
      .selectAll('pattern')
      .data(nodeData)
      .enter()
      .append('pattern')
      .attr('width', 1)
      .attr('height', 1)
      .attr('id', function (d) {
        return 'user_' + user + '_pattern_' + d.name;
      });

    // add background image for cropping
    defs.append('image')
      .attr('xlink:href', this.imageUrl)
      .attr('width', this.imageWidth)
      .attr('height', this.imageHeight)
      .attr('transform', function (d) {
        return 'translate(' + (-d.shiftX + width / 2) + ',' + (-d.shiftY + height / 2) + ')';
      });

    // create axis of timeline
    const minTimestamp = parseInt(fixationData[0].getTimestamp(), 10);
    const maxTimestamp = parseInt(fixationData[fixationData.length - 1].getTimestamp(), 10);
    const xScale = d3.scaleLinear().domain([minTimestamp, maxTimestamp]).range([0, width * fixationData.length]);
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    let gSize = height / 2;
    if (gSize < 7) {
      gSize = 7;
    }
    if (gSize > 30) {
      gSize = 30;
    }
    svg.select('g')
      .attr('size', gSize)
      .attr('font-size', gSize);

    // produce gaze stripe
    svg.selectAll('rect').data(nodeData)
      .enter().append('rect')
      .attr('height', height)
      .attr('width', width)
      .attr('x', function(d) { return parseInt(d.name, 10) * width; })
      .attr('y', 0)
      .attr('fill', function (d) {
        return 'url(#user_' + user + '_pattern_' + d.name + ')';
      })
      .attr('stroke', 'gray')
      .attr('stroke-width', '1')
  }
}
