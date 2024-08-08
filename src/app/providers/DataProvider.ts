import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from './Constants';
import { DatePipe } from '@angular/common';
import { I18N } from './i18n.provider';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import config from 'capacitor.config';

@Injectable({
    providedIn: "root"
})
export class DataProvider implements Resolve<any> {

    private initialized!: boolean;

    private initialPromise!: Promise<boolean>;

    constructor(private httpClient: HttpClient,
        private datepipe: DatePipe, private i18n: I18N) {
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        await this.initCache();
    }

    public async initCache(): Promise<boolean> {

        if (!Constants.loaded) {

            await this.httpClient.get('assets/settings.json')
                .toPromise()
                .then((settings: any) => {
                    if (settings) {
                        Constants.protocol = settings.protocol || Constants.protocol;
                        Constants.baseUrl = settings.baseUrl || Constants.baseUrl;
                        Constants.baseUrl = Constants.protocol + Constants.baseUrl;
                        Constants.loaded = true;
                    }
                })
                .catch((err) => {
                    console.log("Failed to load settings from ebook.settings.json");
                });

            await this.loadI18N();
        }

        if (this.initialized) {
            return new Promise((resolve) => { resolve(true) });
        }

        if (this.initialPromise) {
            return this.initialPromise;
        }

        return this.initialPromise;
    }


    public getDirection(lang: string): boolean {
        if (lang === "ar") {
            return (true);
        } else {
            return (false);
        }
    }

    public getGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    convertStringToDate(strDate): string {
        if (typeof strDate === 'undefined') {
            return ('');
        }
        if (strDate === '') {
            return ('');
        }
        const event = new Date(strDate);
        event.toISOString();
        let new_date = "" + event;
        new_date = this.datepipe.transform(new_date, 'yyyy/MM/dd');
        return (new_date);
    }

    timeString(hr: number, min: number): string {
        if (min < 10) {
            return hr + ':0' + min;
        } else {
            return hr + ':' + min;
        }
    }


    localize(target: any[], fields?: string[]) {
        if (!target || !target.length) return;

        if (!fields) fields = ['name'];

        let lang = I18N.lang;

        target.map((item: any) => {
            if (!item) return;

            if ('load' in item && typeof (item.load) === 'function') {
                // Handle objects that can localize themselves..
                item.load(item)
            }
            else if ('name' in item && 'value' in item) {
                // Handle DataItem instances..
                item.name = this.getName(item.value, fields[0], lang) || item.name;
                // and their children recursively..
                if ('children' in item && Array.isArray(item.children)) {
                    this.localize(item.children, fields);
                }
            }
            else {
                // Handle records with possibly multiple fields..
                for (let fld of fields) {
                    item[fld + '_local'] = this.getName(item, fld, lang)
                }
            }
        })
    }

    getName(item: any, field: string, lang: string) {
        return item[field + '_' + lang] || item[field + '_en'] || item[field];
    }

    async loadI18N() {
        await this.httpClient.get('assets/i18.json')
            .toPromise()
            .then((response: any) => {
                if (response) {
                    this.i18n.load(response);
                    this.i18n.switch(I18N.lang);
                } else {
                }
            })
    }
    // async GetVisitLookups(): Promise<any> {
    //     let url = Constants.baseUrl + 'Visit/GetLookups';
    //     return this.httpClient.get(url)
    //         .toPromise()
    //         .then((data) => {
    //             return data;
    //         })
    //         .catch(err => {
    //             return null;
    //         });
    // }
}