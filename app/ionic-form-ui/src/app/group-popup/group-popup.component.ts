import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {AddgroupmemberComponent} from 'src/app/addgroupmember/addgroupmember.component';

@Component({
  selector: 'app-group-popup',
  templateUrl: './group-popup.component.html',
  styleUrls: ['./group-popup.component.scss']
})
export class GroupPopupComponent implements OnInit {
	constructor(private modalController: ModalController) { }

    async close(){
	  await this.modalController.dismiss();
	}
	
  async addMember(){
	  const modal = await this.modalCtrl.create({
		  component: AddgroupmemberComponent
	  })
	  await modal.present();
  }
	
	
  
  
  ngOnInit() {}

}
