import { Injectable } from "@angular/core";
import { isPlatform } from "@ionic/angular";
import { Constants } from "../providers/Constants";
import { AdLoadInfo, AdMob, AdMobRewardItem, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize, RewardAdOptions, RewardAdPluginEvents } from "@capacitor-community/admob";

@Injectable({
    providedIn: 'root'
})
export class AdsService {
    constructor() {
    }

    // Initialize admob
    public static async adInitialize() {
        const { status } = await AdMob.trackingAuthorizationStatus();
        if (status === 'notDetermined') {
            console.log("Display information before ads load first time");
        }
        AdMob.initialize({
            // requestTrackingAuthorization: true,
            initializeForTesting: Constants.enable_test_ads,
        });
    }

    public static async showBanner() {
        const options: BannerAdOptions = {
            adId: Constants.admob_banner_ad_id,
            isTesting: Constants.enable_test_ads,
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.TOP_CENTER,
            margin: 0
        }
        await AdMob.showBanner(options);
    }

    public static async hideBanner() {
        await AdMob.hideBanner();
    }
    public static async removeBanner() {
        await AdMob.removeBanner();
    }

    static adCounter: number = 0;
    public static async showInterstitial() {
        if (isPlatform('capacitor')) {
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

    public static async showRewarded() {
        if (isPlatform('capacitor')) {
            AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
                // Subscribe prepared rewardVideo
              });
            
              AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem: AdMobRewardItem) => {
                // Subscribe user rewarded
                console.log(rewardItem);
              });
            
              const options: RewardAdOptions = {
                adId: Constants.admob_Reward_ad_id,
                isTesting: Constants.enable_test_ads
                // npa: true
                // ssv: {
                //   userId: "A user ID to send to your SSV"
                //   customData: JSON.stringify({ ...MyCustomData })
                //}
              };
              await AdMob.prepareRewardVideoAd(options);
              const rewardItem = await AdMob.showRewardVideoAd();
        }
    }

    

}

