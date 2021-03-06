import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppComponent } from './app.component';
import { AttentionCloudComponent } from './attention-cloud/attention-cloud.component';
import { AttentionHeatmapComponent } from './attention-heatmap/attention-heatmap.component';
import { Ng5SliderModule } from 'ng5-slider';
import { HttpClientModule } from '@angular/common/http';
import { AttentionCloudDirective } from './attention-cloud.directive';
import { OptionsComponent } from './options/options.component';
import { HeatmapDirective } from './heatmap.directive';
import { FormsModule } from '@angular/forms';
import { GazeStripesComponent } from './gaze-stripes/gaze-stripes.component';
import { GazeStripesDirective } from './gaze-stripes.directive';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DragScrollModule } from 'ngx-drag-scroll';
import { MapInfoComponent } from './map-info/map-info.component';
import { RawDataComponent } from './raw-data/raw-data.component';
import { AttentionBarsChartComponent } from './attention-bars-chart/attention-bars-chart.component';
import { AttentionDataComponent } from './attention-data/attention-data.component';
import { AttentionBarsChartDirective } from './attention-bars-chart.directive';



@NgModule({
  declarations: [
    AppComponent,
    AttentionCloudComponent,
    AttentionHeatmapComponent,
    AttentionCloudDirective,
    OptionsComponent,
    HeatmapDirective,
    GazeStripesComponent,
    GazeStripesDirective,
    MapInfoComponent,
    RawDataComponent,
    AttentionBarsChartComponent,
    AttentionDataComponent,
    AttentionBarsChartDirective
  ],
  imports: [
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    Ng5SliderModule,
    NgbModule,
    DragScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
