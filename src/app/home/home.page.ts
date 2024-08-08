import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataProvider } from '../providers/DataProvider';
import { I18N } from '../providers/i18n.provider';
import { Constants } from '../providers/Constants';
import { AdMob, AdOptions } from '@capacitor-community/admob';
import { ToastController } from '@ionic/angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { Network } from '@capacitor/network';
import { Router } from '@angular/router';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  sublang: Subscription;
  lang: string = "ar";
  direction: boolean = true;
  rtl: string = 'rtl';
  subBackBtn: Subscription;

  selected_age: string = this.getCurrentAge();
  selected_hens_age: string = this.getCurrentHensAge();
  selected_baladi_age: string = this.getCurrentBaladiAge();
  selected_quail_age: string = this.getCurrentQuailAge();
  selected_sasso_age: string = this.getCurrentSassoAge();

  window_width = window.innerWidth;
  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private toastController: ToastController,
    private provider: DataProvider,
    public i18n: I18N) {
    //check internet connection
    Network.getStatus().then((status) => {
      if (!status.connected) {
        this.presentNetworkToast('bottom', this.i18n.get('app.global.no_internet'));
      }
    })
  }



  ngOnInit() {
    this.sublang = this.i18n.observeLanguage().subscribe({
      next: (lang) => {
        this.lang = lang;
        this.direction = this.provider.getDirection(this.lang);
      }
    });

    this.lang = I18N.lang;
    this.direction = this.provider.getDirection(this.lang);
    if (this.direction) {
      this.rtl = 'rtl';
    }
    else {
      this.rtl = 'ltr';
    }

  }

  ngOnDestroy() {
    if (this.sublang) {
      this.sublang.unsubscribe();
    }
    if (this.subBackBtn) {
      this.subBackBtn.unsubscribe();
    }
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

  async presentNetworkToast(position: 'top' | 'middle' | 'bottom', text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 15000,
      position: position,
      color: 'danger',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    await toast.present();
  }


  getCurrentAge(): string {
    let saved_age: string = localStorage.getItem(Constants.localstorage_broiler_age);
    let saved_date: string = localStorage.getItem(Constants.localstorage_broiler_date);
    if (saved_date) {
      let date_sent = new Date(saved_date);
      let curren_date = new Date();
      let diff = Math.floor((Date.UTC(curren_date.getFullYear(), curren_date.getMonth(), curren_date.getDate()) - Date.UTC(date_sent.getFullYear(), date_sent.getMonth(), date_sent.getDate())) / (1000 * 60 * 60 * 24));
      let new_age = parseInt(saved_age) + diff;
      if (new_age > 35) {
        new_age = 35;
      }
      return '' + new_age;
    }
  }

  getCurrentHensAge(): string {
    let saved_age: string = localStorage.getItem(Constants.localstorage_laying_hens_age);
    let saved_date: string = localStorage.getItem(Constants.localstorage_laying_hens_date);
    if (saved_date) {
      let date_sent = new Date(saved_date);
      let curren_date = new Date();
      let diff = Math.floor((Date.UTC(curren_date.getFullYear(), curren_date.getMonth(), curren_date.getDate()) - Date.UTC(date_sent.getFullYear(), date_sent.getMonth(), date_sent.getDate())) / (1000 * 60 * 60 * 24));
      let new_age = parseInt(saved_age) + diff;
      if (new_age > 154) {
        new_age = 154;
      }
      return '' + new_age;
    }
  }

  getCurrentBaladiAge(): string {
    let saved_age: string = localStorage.getItem(Constants.localstorage_baladi_age);
    let saved_date: string = localStorage.getItem(Constants.localstorage_baladi_date);
    if (saved_date) {
      let date_sent = new Date(saved_date);
      let curren_date = new Date();
      let diff = Math.floor((Date.UTC(curren_date.getFullYear(), curren_date.getMonth(), curren_date.getDate()) - Date.UTC(date_sent.getFullYear(), date_sent.getMonth(), date_sent.getDate())) / (1000 * 60 * 60 * 24));
      let new_age = parseInt(saved_age) + diff;
      if (new_age > 154) {
        new_age = 154;
      }
      return '' + new_age;
    }
  }

  getCurrentQuailAge(): string {
    let saved_age: string = localStorage.getItem(Constants.localstorage_quail_age);
    let saved_date: string = localStorage.getItem(Constants.localstorage_quail_date);
    if (saved_date) {
      let date_sent = new Date(saved_date);
      let curren_date = new Date();
      let diff = Math.floor((Date.UTC(curren_date.getFullYear(), curren_date.getMonth(), curren_date.getDate()) - Date.UTC(date_sent.getFullYear(), date_sent.getMonth(), date_sent.getDate())) / (1000 * 60 * 60 * 24));
      let new_age = parseInt(saved_age) + diff;
      if (new_age > 45) {
        new_age = 45;
      }
      return '' + new_age;
    }
  }

  getCurrentSassoAge(): string {
    let saved_age: string = localStorage.getItem(Constants.localstorage_sasso_age);
    let saved_date: string = localStorage.getItem(Constants.localstorage_sasso_date);
    if (saved_date) {
      let date_sent = new Date(saved_date);
      let curren_date = new Date();
      let diff = Math.floor((Date.UTC(curren_date.getFullYear(), curren_date.getMonth(), curren_date.getDate()) - Date.UTC(date_sent.getFullYear(), date_sent.getMonth(), date_sent.getDate())) / (1000 * 60 * 60 * 24));
      let new_age = parseInt(saved_age) + diff;
      if (new_age > 60) {
        new_age = 60;
      }
      return '' + new_age;
    }
  }
  goToBroiler() {
    this.router.navigate(["broiler"], { replaceUrl: true });
  }

  goToSasso() {
    this.router.navigate(["sasso-cycle"], { replaceUrl: true });
  }

  goToLayingHens() {
    this.router.navigate(["laying-hens"], { replaceUrl: true });
  }

  goToRobot() {
    this.router.navigate(["robot"], { replaceUrl: true });
  }

  goToAgeCalculator() {
    this.router.navigate(["age-calculator"], { replaceUrl: true });
  }

  goToFStudy() {
    this.router.navigate(["fstudy"], { replaceUrl: true });
  }

  goToLayingHensCycle() {
    this.router.navigate(["laying-hens-cycle"], { replaceUrl: true });
  }

  goToMenu() {
    this.router.navigate(["menu"], { replaceUrl: true });
  }

  goToBaladiCycle() {
    this.router.navigate(["baladi-cycle"], { replaceUrl: true });
  }

  goToQuailCycle() {
    this.router.navigate(["quail-cycle"], { replaceUrl: true });
  }

} 