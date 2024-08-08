import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HomePage } from './home/home.page';
import { MenuController, NavController, ToastController, isPlatform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { I18N } from './providers/i18n.provider';
import { DataProvider } from './providers/DataProvider';
import { NavigationEnd, Router } from '@angular/router';
import { Constants } from './providers/Constants';
import { App } from '@capacitor/app';
import { AdMob, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import config from 'capacitor.config';
import { Title } from '@angular/platform-browser';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  rootPage: any = HomePage;

  lang: string = '';
  langImage: string = "assets/images/lang-en.png"
  sublang!: Subscription;
  direction: boolean = true;

  isToggledLang: boolean = true;
  isToggledTheme: boolean = true;

  isUserLogin: boolean = false;
  userLoginsub!: Subscription;
  imgProfile: string = "";
  userName?: { ar: string, en: string } = { 'ar': '', 'en': '' };

  url: string = '';
  routerSub: Subscription;
  appName_ar = config.appName_ar;
  appName_en = config.appName_en;
  constructor(
    private titleService: Title,
    public navCtrl: NavController,
    private router: Router,
    private provider: DataProvider,
    private menu: MenuController,
    private toastController: ToastController,
    public i18n: I18N) {
    if (isPlatform('capacitor')) {
      //initializa ads
      this.adInitialize().then(() => {
        this.showBanner();
      });
    }

    Network.addListener('networkStatusChange', status => {
      if (!status.connected) {
        this.presentFailedToast('bottom', this.i18n.get('app.global.no_internet'));
      }
      // else if (status.connected) {
      //   this.presentSuccessToast('bottom', this.i18n.get('app.global.has_internet'));
      // }
      console.log('Network status changed', status);
    });
  }

  async getDeviceLanguage() {
    let deivce_language = (await Device.getLanguageCode()).value;
    console.log('device language : ' + deivce_language); // en-US
    if (deivce_language) {
      this.lang = deivce_language;
      this.i18n.switch(deivce_language);
    }
  }

  toast: HTMLIonToastElement;
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
  // Initialize admob
  async adInitialize() {
    const { status } = await AdMob.trackingAuthorizationStatus();
    if (status === 'notDetermined') {
      console.log("Display information before ads load first time");
    }
    AdMob.initialize({
      // requestTrackingAuthorization: true,
      initializeForTesting: Constants.enable_test_ads,
    });
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

  async showBanner() {
    const options: BannerAdOptions = {
      adId: Constants.admob_banner_ad_id,
      isTesting: Constants.enable_test_ads,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin: 0
    }
    await AdMob.showBanner(options);
  }

  async hideBanner() {
    await AdMob.hideBanner();
  }
  // async removeBanner() {
  //   await AdMob.removeBanner();
  // }

  ngOnInit() {
    this.sublang = this.i18n.observeLanguage().subscribe({
      next: (lang) => {
        this.lang = lang;
        this.direction = this.provider.getDirection(this.lang);
      }
    });
    let stored_lang = localStorage.getItem('uiLang');
    if (!stored_lang) {
      this.getDeviceLanguage();
    }
    this.lang = I18N.lang;

    this.direction = this.provider.getDirection(this.lang);
    this.isToggledLang = !this.direction;
    this.toggleAppLang();

    //for web browser bar
    if (this.lang == 'ar') {
      document.getElementById('appName').innerText = this.appName_ar;
      this.titleService.setTitle(this.appName_ar);
    } else {
      document.getElementById('appName').innerText = this.appName_en;
      this.titleService.setTitle(this.appName_en);
    }

  }


  ngAfterViewInit() {
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url.split('/')[1];
        console.log("url " + this.url);
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  toggleAppLang() {
    if (this.isToggledLang) {
      this.lang = "en";
      this.langImage = "assets/images/lang-ar.png";
    } else {
      this.lang = "ar";
      this.langImage = "assets/images/lang-en.png";
    }
    this.i18n.switch(this.lang);
  }

  goToHome() {
    this.router.navigate(["home"], { replaceUrl: true });
  }

  exitApp() {
    App.exitApp();
  }

}