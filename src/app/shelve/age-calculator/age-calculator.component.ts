import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdMob, AdOptions } from '@capacitor-community/admob';
import { IonModal, ToastController, isPlatform } from '@ionic/angular';
import { Constants } from 'src/app/providers/Constants';
import { OverlayEventDetail } from '@ionic/core/components';
import { AgeCalculator } from 'src/app/model/ageCalculator';
import { I18N } from 'src/app/providers/i18n.provider';

@Component({
  selector: 'app-age-calculator',
  templateUrl: './age-calculator.component.html',
  styleUrls: ['./age-calculator.component.scss'],
})
export class AgeCalculatorComponent implements OnInit {

  @ViewChild(IonModal) modal: IonModal;

  all_data: AgeCalculator[] = localStorage.getItem(Constants.localstorage_age_calculator_array) ? JSON.parse(localStorage.getItem(Constants.localstorage_age_calculator_array)) : [];
  masterRecord: AgeCalculator = new AgeCalculator();
  constructor(
    public i18n: I18N,
    public dialog: MatDialog,
    private toastController: ToastController,) { }

  ngOnInit() {
  }

  adCounter: number = 0;
  async showInterstitial() {
    this.adCounter++;
    if (this.adCounter % Constants.show_ad_after === 0) { //show ads after each #of clicks
      const options: AdOptions = {
        adId: Constants.admob_interstitial_ad_id,
        isTesting: Constants.enable_test_ads
        // npa: true
      };
      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
    }
  }

  toast: HTMLIonToastElement;
  async presentSuccessToast(position: 'top' | 'middle' | 'bottom', text) {
    if (this.toast) {
      this.toast.dismiss();
    }
    this.toast = await this.toastController.create({
      message: text,
      duration: 150000,
      position: position,
      color: 'success',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          handler: () => {
            this.toast.dismiss();
          }
        }
      ]
    });
    await this.toast.present();
  }

  cancel() {
    if (isPlatform('capacitor')) {
      this.showInterstitial();
    }
    this.modal.dismiss(null, 'cancel');
    this.modal.isOpen = false;
  }

  confirm() {
    if (isPlatform('capacitor')) {
      this.showInterstitial();
    }
    //for id
    if (!this.masterRecord.id) {
      if (this.all_data.length > 0) {
        this.masterRecord.id = this.all_data[this.all_data.length - 1].id + 1;
      } else {
        this.masterRecord.id = 1;
      }
    }
    if (!this.masterRecord.name) {
      this.presentFailedToast('bottom', this.i18n.get('app.wize.robo_name_err'));
      return;
    } else if (!this.masterRecord.age) {
      this.presentFailedToast('bottom', this.i18n.get('app.wize.robo_age_err'));
      return;
    } else if (!this.masterRecord.notes) {
      this.presentFailedToast('bottom', this.i18n.get('app.wize.robo_notes_err'));
      return;
    } else {
      this.modal.dismiss(this.masterRecord, 'confirm');
      this.modal.isOpen = false;
    }
  }

  async presentFailedToast(position: 'top' | 'middle' | 'bottom', text) {
    if (this.toast) {
      this.toast.dismiss();
    }
    this.toast = await this.toastController.create({
      message: text,
      duration: 150000,
      position: position,
      color: 'danger',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          handler: () => {
            this.toast.dismiss();
          }
        }
      ]
    });
    await this.toast.present();
  }
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      if (!this.all_data.find(item => item.id == this.masterRecord.id)) {
        this.all_data.push(this.masterRecord);
      }
      localStorage.setItem(Constants.localstorage_age_calculator_array, JSON.stringify(this.all_data));
      this.masterRecord = new AgeCalculator();
      this.presentSuccessToast('bottom', this.i18n.get('app.age_calculator.saved'));
    }
  }


  getCurrentAge(selected_row: AgeCalculator): string {
    if (selected_row.date) {
      let date_sent = new Date(selected_row.date);
      let curren_date = new Date();
      let diff = Math.floor((Date.UTC(curren_date.getFullYear(), curren_date.getMonth(), curren_date.getDate()) - Date.UTC(date_sent.getFullYear(), date_sent.getMonth(), date_sent.getDate())) / (1000 * 60 * 60 * 24));
      let new_age = selected_row.age + diff;
      return '' + new_age;
    }
  }

  deleteTransaction(selected_row: AgeCalculator) {
    this.all_data.splice(this.all_data.indexOf(selected_row), 1);
    localStorage.setItem(Constants.localstorage_age_calculator_array, JSON.stringify(this.all_data));
  }

  openModal(selected_row: AgeCalculator) {
    this.masterRecord = selected_row;
    this.modal.isOpen = true;
  }

}
