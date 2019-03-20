import { Component, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AttentionCloudService } from '../attention-cloud.service';
import { Station } from '../classes/Station';
import { User } from '../classes/User';
import { DisplayConfiguration} from '../classes/DisaplyConfiguration';
import { FormGroup, FormControl } from '@angular/forms';
import { Options } from 'ng5-slider';
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  modalRef: BsModalRef;
  currentStimulus: string;
  currentUsers: User[];
  availableStations: Station[];
  availableUsers: User[];
  sliderTimeStampOptions: Options;
  sliderTimestamp: FormGroup;
  timestampStart: number;
  timestampEnd: number;
  @Output() currentDisplayConfigurationEvent = new EventEmitter<DisplayConfiguration>();
  constructor(private attentionCloudService: AttentionCloudService, private modalService: BsModalService) {
    this.availableUsers = [];
    this.availableStations = [];
    this.currentUsers = [];
    this.currentStimulus = '';
    this.timestampStart = 0;
    this.timestampEnd = 10;
    this.sliderTimestamp = new FormGroup({
      sliderControl: new FormControl()
    });
  }

  ngOnInit() {
    this.attentionCloudService.getAllStations().subscribe((data: Object[]) => {
      data.forEach(element => {
        const name = element['name'];
        const width = parseInt(element['width'], 10);
        const height = parseInt(element['height'], 10);
        const complexity = parseInt(element['complexity'], 10);
        const description = element['description'];
        const stimuli = element['stimuli_list'];

        this.availableStations.push(new Station(name, stimuli, complexity, height, width, description));
      });
    });
  }

  public toogleSelectedUser(user: User) {
    if (!user.isSelected()) {
      this.currentUsers.push(user);
      user.setSelected(true);
    } else {
      const index_to_remove = this.currentUsers.indexOf(user);
      user.setSelected(false);
      this.currentUsers.splice(index_to_remove, 1);
    }
  }

  public changeCurrentStimulus(stimulus: string) {
    this.currentStimulus = stimulus;
    this.attentionCloudService.getAllUserByStimulus(stimulus).subscribe((data: string[]) => {
      this.availableUsers = [];
      data.forEach(id => {
        this.availableUsers.push(new User(id));
      });
      this.currentUsers = [];
    });

    this.attentionCloudService.getMinAndMaxTimestamp(stimulus).subscribe((res: any) => {
      this.timestampStart = parseInt(res.min, 10);
      this.timestampEnd = parseInt(res.max, 10);
      this.sliderTimestamp = new FormGroup({
        sliderControl: new FormControl([this.timestampStart, this.sliderTimestamp])
      });
      this.sliderTimeStampOptions = {
        floor: this.timestampStart,
        ceil: this.timestampEnd
      };
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' }));
  }

  generate() {
    this.currentDisplayConfigurationEvent.emit(new DisplayConfiguration(
      this.currentUsers,
      this.currentStimulus,
      this.timestampStart,
      this.timestampEnd
    ));
  }



}
