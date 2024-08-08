import { HttpHeaders } from '@angular/common/http';

export class Constants {

    public static loaded: boolean = false;

    public static httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        reportProgress: true as const,
        observe: 'events' as const,
        withCredentials: true
    };

    public static protocol: string = "https://";
    public static baseUrl: string = Constants.protocol + "localhost:8901";

    public static key_counter: string = 'counter'; //unfinished tasks

    //admob
    public static show_ad_after: number = 2;
    public static admob_banner_ad_id: string = 'ca-app-pub-7980797173218475/6852523548';
    public static admob_interstitial_ad_id: string = 'ca-app-pub-7980797173218475/7894142474';
    public static admob_Reward_ad_id: string = 'ca-app-pub-7980797173218475/5483432673';

    public static enable_test_ads: boolean = false; // ads for test true// false for production

    public static localstorage_broiler_age: string = 'age';
    public static localstorage_laying_hens_age: string = 'hens_age';
    public static localstorage_baladi_age: string = 'baladi_age';
    public static localstorage_quail_age: string = 'quail_age';
    public static localstorage_sasso_age: string = 'sasso_age';

    public static localstorage_broiler_date: string = 'day';
    public static localstorage_laying_hens_date: string = 'hens_day';
    public static localstorage_baladi_date: string = 'baladi_day';
    public static localstorage_quail_date: string = 'quail_day';
    public static localstorage_sasso_date: string = 'sasso_day';

    public static localstorage_broiler_quantity: string = 'broiler_quantity';
    public static localstorage_laying_hens_quantity: string = 'hens_quantity';
    public static localstorage_baladi_quantity: string = 'baladi_quantity';
    public static localstorage_sasso_quantity: string = 'sasso_quantity';

    public static localstorage_ccr_fontSize: string = 'ccr_fontSize';
    public static localstorage_robot_fontSize: string = 'robot_fontSize';
    public static localstorage_lastupdate_fpa: string = 'fpa_lastupdate';
    public static localstorage_lastupdate_fpa_data: string = 'fpa_lastupdate_data';
    public static localstorage_lastupdate_fpp: string = 'fpp_lastupdate';
    public static localstorage_lastupdate_fpp_data: string = 'fpp_lastupdate_data';
    public static localstorage_age_calculator_array:string = 'age_calculator_array'
}