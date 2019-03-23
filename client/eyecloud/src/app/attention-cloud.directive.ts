import { Directive, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { Thumbnail } from './attention-cloud/classes/Thumbnail';
import { Point } from './classes/Utilities';

@Directive({
  selector: '[appAttentionCloud]'
})

export class AttentionCloudDirective implements OnChanges {
  @Input() thumbnailData: Thumbnail[];
  @Input() imageUrl; string;
  @Input() imageWidth: number;
  @Input() imageHeight: number;
  @Input() selectedPoint: Point;

  constructor() { }

  ngOnChanges() {
    if (this.selectedPoint !== undefined) {
      let selectedId;
      let max_distance;
      // find the nearest thumbnail from the selected point
      this.thumbnailData.forEach((thumbnail) => {
        const distance = ((this.selectedPoint.x - thumbnail.styleX) ** 2) + ((this.selectedPoint.y - thumbnail.styleY) ** 2);
        if (max_distance === undefined || distance < max_distance) {
          max_distance = distance;
          selectedId = thumbnail.id;
        }
      });
      // set the selected thumbnail
      this.thumbnailData.forEach((thumbnail) => {

        if (thumbnail.id === selectedId) {
          thumbnail.selected = true;
        } else {
          thumbnail.selected = false;
        }
      });
    }

    const svg = d3.select('#svg-attention-cloud');
    const width = parseInt(svg.attr('width'), 10);
    const height = parseInt(svg.attr('height'), 10);

    // reset svg
    svg.selectAll('*').remove();

    // create note data from thumbnail data
    const nodeData = [];
    if (this.thumbnailData === undefined) {
      return;
    }
    for (let i = 0; i < this.thumbnailData.length; i++) {
      const thumbnail = this.thumbnailData[i];
      nodeData.push({
        'name': thumbnail.id, 'r': thumbnail.croppingSize,
        'x': thumbnail.positionX, 'y': thumbnail.positionY,
        'shiftX': thumbnail.styleX, 'shiftY': thumbnail.styleY,
        'selected': thumbnail.selected
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
        return 'pattern_' + d.name;
      });

    // add background image for cropping
    defs.append('image')
      .attr('xlink:href', this.imageUrl)
      .attr('width', this.imageWidth)
      .attr('height', this.imageHeight)
      .attr('transform', function (d) {
        return 'translate(' + -d.shiftX + ',' + -d.shiftY + ')';
      });

    this.generateForceSimulation(svg, nodeData, width, height);

  }

  private generateForceSimulation(svg, nodeData, width, height) {

    // produce forces
    const attractForce = d3.forceManyBody().strength(50);

    const collisionForce = d3.forceCollide().radius(function (d: any) {
      return d.r / 2 + 1;
    }).iterations(5);

    // force simulation
    const simulation = d3.forceSimulation(nodeData).alphaDecay(0.01)
      .force('attractForce', attractForce)
      .force('collisionForce', collisionForce)
      .force('center', d3.forceCenter(width / 2, height / 2));

    // produce nodes from node data
    const node = svg.selectAll('circle').data(nodeData)
      .enter().append('circle')
      .attr('r', function (d) { return d.r / 2; })
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('fill', function (d) {
        return 'url(#pattern_' + d.name + ')';
      })
      .attr('stroke', (d) => {
        return (d.selected ? 'red' : 'gray');
      })
      .attr('stroke-width', '2')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    function dragstarted(d) {
      simulation.restart();
      simulation.alpha(0.7);
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      d.fx = null;
      d.fy = null;
      simulation.alphaTarget(0.1);
    }

    function ticked() {
      node.attr('cx', function (d) {
        return Math.max(d.r, Math.min(width - d.r, d.x));
      }).attr('cy', function (d) {
        return Math.max(d.r, Math.min(height - d.r, d.y));
      });
    }

    // start simulation
    simulation.on('tick', ticked);
  }
}


