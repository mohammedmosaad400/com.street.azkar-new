import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { I18N } from 'src/app/providers/i18n.provider';
import { AdsService } from 'src/app/services/ads.service';

@Component({
  selector: 'app-rewarded-ad-confirm',
  templateUrl: './rewarded-ad-confirm.component.html',
  styleUrls: ['./rewarded-ad-confirm.component.scss'],
})
export class RewardedAdConfirmComponent implements OnInit {

  message: string = "";
  title: string = "";
  yes: string = "";
  no: string = "";

  is_loading: boolean = false;
  constructor(
    private i18n: I18N,
    public dialogRef: MatDialogRef<RewardedAdConfirmComponent>) { }

  ngOnInit() { }

  public decline() {
    this.dialogRef.close(false);
  }

  public accept() {
    // this.dialogRef.close(true);
    this.is_loading = true;
    this.message = this.i18n.get('app.admob.before_watch_ad_msg');
    this.watchAdBtnClicked();
  }

  public dismiss() {
    this.dialogRef.close(null);
  }

  watchAdBtnClicked() {
    AdsService.showRewarded().then(result => {
      setTimeout(() => {
        this.is_loading = false;
        this.dialogRef.close(true);
      }, 5000);
      console.log('show result ' + result);
    }).catch((error) => {
      setTimeout(() => {
        this.is_loading = false;
        this.dialogRef.close(true);
      }, 5000);
    });
  }

}
