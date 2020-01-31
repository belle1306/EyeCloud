import { Component, OnInit } from '@angular/core';
import { AttentionCloudService } from '../attention-cloud.service';
import { Point, Utilities } from '../classes/Utilities';
import { Thumbnail } from '../classes/Thumbnail';
import { AggregatedFixationPoint } from '../classes/AggregatedFixationPoints';

@Component({
  selector: 'app-attention-data',
  templateUrl: './attention-data.component.html',
  styleUrls: ['./attention-data.component.css']
})
export class AttentionDataComponent implements OnInit {

  displayComponent: boolean;
  clouds: Thumbnail[];
  selectedPoint: AggregatedFixationPoint;

  constructor(private attentionCloudService: AttentionCloudService) {
    this.displayComponent = false;
    this.clouds = [];
  }
  ngOnInit() {
    this.attentionCloudService.cloudsVisible.subscribe((clouds: Thumbnail[]) => {
      if (clouds) {
        this.clouds = clouds;
      }
    });
    this.attentionCloudService.currentSelectedPoint.subscribe((point: Point) => {
      if (this.clouds && this.clouds.length > 0) {
        let minDistance = Utilities.euclideanDistance(new Point(this.clouds[0].getX(), this.clouds[0].getY()), point);
        let selectedCloud = this.clouds[0];
        for (let cloud of this.clouds) {
          let distance = Utilities.euclideanDistance(new Point(cloud.getX(), cloud.getY()), point);
          if (distance < minDistance) {
            selectedCloud = cloud;
          }
        }
        this.selectedPoint = selectedCloud.getAggregatedFixationPoint();
        this.displayComponent = true;
      } else {
        this.displayComponent = false;
      }
    });
  }

}
