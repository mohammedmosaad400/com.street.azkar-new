import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { I18N } from 'src/app/providers/i18n.provider';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  lang: string = "ar";
  langImage: string = "assets/images/lang-en.png"
  sublang!: Subscription;
  direction: boolean = true;
  constructor(private router: Router, public i18n: I18N) { }

  ngOnInit() { }

  goToHome() {
    this.router.navigate(["home"], { replaceUrl: true });
  }

  goToBroilerCycle() {
    this.router.navigate(["broiler"], { replaceUrl: true });
  }

  goToSassoCycle() {
    this.router.navigate(["sasso-cycle"], { replaceUrl: true });
  }

  goToQuailCycle() {
    this.router.navigate(["quail-cycle"], { replaceUrl: true });
  }

  goToQuailDisease() {
    this.router.navigate(["quail-disease"], { replaceUrl: true });
  }

  goToLayingHensCycle() {
    this.router.navigate(["laying-hens-cycle"], { replaceUrl: true });
  }

  goToBaladiCycle() {
    this.router.navigate(["baladi-cycle"], { replaceUrl: true });
  }

  goToccrTable() {
    this.router.navigate(["ccr"], { replaceUrl: true });
  }

  goToFeedCalculator() {
    this.router.navigate(["feed-calculator"], { replaceUrl: true });
  }

  goToAreaCalculator() {
    this.router.navigate(["area-calculator"], { replaceUrl: true });
  }

  goToAgeCalculator() {
    this.router.navigate(["age-calculator"], { replaceUrl: true });
  }

  goToFeedPriceAvg() {
    this.router.navigate(["fpa"], { replaceUrl: true });
  }

  goToFinalProduct() {
    this.router.navigate(["fpp"], { replaceUrl: true });
  }

  goToFStudy() {
    this.router.navigate(["fstudy"], { replaceUrl: true });
  }

  goToLayingHens() {
    this.router.navigate(["laying-hens"], { replaceUrl: true });
  }

  goToRobot() {
    this.router.navigate(["robot"], { replaceUrl: true });
  }

  goToFeedOutletList() {
    this.router.navigate(["feed-outlet-list"], { replaceUrl: true });
  }

  changeLanguage() {
    if (this.lang == 'ar') {
      this.lang = 'en';
    } else {
      this.lang = 'ar';
    }
    this.i18n.switch(this.lang);
  }

}
