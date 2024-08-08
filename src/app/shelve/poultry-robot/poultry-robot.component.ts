import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdMob, AdOptions } from '@capacitor-community/admob';
import { GenerativeModel, HarmBlockThreshold, HarmCategory, SafetySetting } from '@google/generative-ai';
import { ToastController, isPlatform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/model/message.type';
import { Constants } from 'src/app/providers/Constants';
import { DataProvider } from 'src/app/providers/DataProvider';
import { I18N } from 'src/app/providers/i18n.provider';
import { GenerativeService } from 'src/app/services/generative.service';
import { SpeechService } from 'src/app/services/speech.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Share } from '@capacitor/share';
import config from 'capacitor.config';
import { Network } from '@capacitor/network';
import { AdsService } from 'src/app/services/ads.service';
import { RewardedAdConfirmComponent } from 'src/app/common/rewarded-ad-confirm/rewarded-ad-confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-poultry-robot',
  templateUrl: './poultry-robot.component.html',
  styleUrls: ['./poultry-robot.component.scss'],
})
export class PoultryRobotComponent implements OnInit, AfterViewInit {
  protected disabled = false;
  protected speechActive = false;
  protected output = '';
  protected prompt = '';
  private speech = inject(SpeechService);
  protected languages = this.speech.languages;
  protected currentLanguage = 'en-US';

  private generativeService: GenerativeService = inject(GenerativeService);
  private model: GenerativeModel | null = null;

  messageList: Message[] = [];
  sublang: Subscription;
  lang: string = "ar";
  direction: boolean = true;
  rtl: string = 'rtl';
  old_fontSize: number = localStorage.getItem(Constants.localstorage_robot_fontSize) ? parseInt(localStorage.getItem(Constants.localstorage_robot_fontSize)) : 18;
  watched_rewarded_ad: boolean = false;
  constructor(private router: Router,
    private dialog: MatDialog,
    private toastController: ToastController,
    private clipboard: Clipboard,
    private provider: DataProvider,
    public i18n: I18N) {
    this.model = this.generativeService.getModel();

    let safetySetting: SafetySetting[] = [{
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }, {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }, {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }, {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }, {
      category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }];
    this.model.safetySettings = safetySetting;
  }
  ngAfterViewInit(): void {
    //robot start message
    this.messageList.push({
      id: 1,
      date: new Date().toISOString(),
      is_read: false,
      time: new Date().toISOString(),
      isOwner: false,
      text: this.i18n.get('app.wize.robot_start')
    });
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

    if (!this.watched_rewarded_ad) {
      this.watchRewardedAdConfirm();
    }
  }

  watchRewardedAdConfirm() {
    const dialogRef = this.dialog.open(RewardedAdConfirmComponent, { panelClass: 'popup-modal' });
    dialogRef.componentInstance.title = this.i18n.get('app.admob.unlock_robot', 'unlock_robot');
    dialogRef.componentInstance.message = this.i18n.get('app.admob.watch_ad_msg', 'watch_ad');
    dialogRef.componentInstance.yes = this.i18n.get('app.admob.watch_ad_btn', 'watch_ad_btn');

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.watched_rewarded_ad = true;
      }
    });
  }

  watchAdBtnClicked() {
    this.disabled = true;
    AdsService.showRewarded().then(result => {
      console.log('show result ' + result)
      this.watched_rewarded_ad = true;
      this.disabled = false;
    });
  }

  // async speechInput() {
  //   this.prompt = '';
  //   this.speechActive = true;
  //   if (isPlatform('capacitor')) {
  //     SpeechRecognition.start({
  //       language: "ar-EG",
  //       maxResults: 2,
  //       prompt: this.i18n.get('app.speech.say'),
  //       partialResults: true,
  //       popup: true,
  //     });
  //     SpeechRecognition.addListener('partialResults', (data) => {
  //       data.matches.forEach((match) => {
  //         this.prompt += ' ' + match;
  //       });
  //       this.speechActive = false;
  //       this.recognize();
  //     });
  //   } else {
  //     this.prompt = await this.speech.listen(this.currentLanguage);
  //     this.speechActive = false;
  //     this.recognize();
  //   }
  // }

  async recognize() {
    
    if (isPlatform('capacitor')) {
      await this.showInterstitial();
    }

    Network.getStatus().then((status) => {
      if (!status.connected) {
        this.presentFailedToast('bottom', this.i18n.get('app.global.no_internet'));
      }
    });

    this.messageList.push({
      id: 1,
      date: new Date().toISOString(),
      is_read: false,
      time: new Date().toISOString(),
      isOwner: true,
      text: this.prompt
    })

    console.info('Querying the model with prompt', this.prompt);
    this.disabled = true;
    try {
      if (this.model) {
        const result = (await this.model.startChat().sendMessage(this.prompt));
        this.output = '';
        this.prompt = '';
        console.log(result);
        const response = await result.response;
        const text = response.text();
        // this.output = text;
        this.messageList.push({
          id: 1,
          date: new Date().toISOString(),
          is_read: false,
          time: new Date().toISOString(),
          isOwner: false,
          text: text
        })
        console.info('Received output from the model', text);
        await this.say(this.output);
      }
    } finally {
      this.disabled = false;
    }
  }

  async say(text: string) {
    return this.speech.say(text, this.currentLanguage);
  }

  async presentFailedToast(position: 'top' | 'middle' | 'bottom', text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1500,
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

  increaseFont() {
    this.old_fontSize += 1;
    document.getElementById('message_to_change_size').style.fontSize = this.old_fontSize + 'px';
    localStorage.setItem(Constants.localstorage_robot_fontSize, '' + this.old_fontSize);
  }

  decreaseFont() {
    this.old_fontSize -= 1;
    document.getElementById('message_to_change_size').style.fontSize = this.old_fontSize + 'px';
    localStorage.setItem(Constants.localstorage_robot_fontSize, '' + this.old_fontSize);
  }

  async shareQuote(text: string) {
    let text_to_share: string = text + '\n';
    text_to_share += this.i18n.get('app.global.donwload_app') + ' \n ' + 'https://play.google.com/store/apps/details?id=com.street.simsim2';

    // Share text only
    await Share.share({
      title: this.i18n.get('app.ccr.ccr'),
      text: text_to_share,
      dialogTitle: this.lang == 'ar' ? config.appName_ar : config.appName_en
    });
  }

  copyToClipboard(text: string) {
    if (isPlatform('capacitor')) {
      this.showInterstitial();
    }
    let text_to_print: string = text;
    let text_to_copy: string = text + '\n';
    text_to_copy += this.i18n.get('app.global.donwload_app') + ' \n ' + 'https://play.google.com/store/apps/details?id=com.street.simsim2';

    this.clipboard.copy(text_to_copy);
    this.presentToast('bottom', text_to_print);
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', text) {
    const toast = await this.toastController.create({
      message: this.i18n.get('app.global.copied') + '<br>' + text,
      duration: 1500,
      position: position,
    });
    await toast.present();
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
}
