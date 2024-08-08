import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { I18N } from './i18n.provider';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class UIService {


    // static toastOptions = {
    //     "positionClass": "toast-bottom-center",
    //     opacity: 1,
    //     enableHtml: true,
    //     timeOut: 20000
    // }

    constructor(public i18n: I18N, public dialog: MatDialog, public toastController: ToastController) {
        // toastr.toastrConfig.autoDismiss = true;
        // toastr.toastrConfig.countDuplicates = true;
        // toastr.toastrConfig.enableHtml = true;
        // toastr.toastrConfig.maxOpened = 6;
        // toastr.toastrConfig.preventDuplicates = true;
        // toastr.toastrConfig.resetTimeoutOnDuplicate = true;
        // toastr.toastrConfig.positionClass = 'toast-bottom-right';
    }

    async info(message: string, title: string = null) {
        const toast = await this.toastController.create({
            header: (title) ? this.i18n.get(title, title) : null,
            message: this.i18n.get(message, message),
            color: "tertiary",
            animated:true,
            duration: 2000
        });
        toast.present();
        //this.toastr.info(this.i18n.get(message, message), (title)? this.i18n.get(title, title) : null);
    }

    async warning(message: string, title: string = null) {
        const toast = await this.toastController.create({
            header: (title) ? this.i18n.get(title, title) : null,
            message: this.i18n.get(message, message),
            color: "warning",
            animated:true,
            duration: 2000
        });
        toast.present();
    }

    async success(message: string, title: string = null) {
        const toast = await this.toastController.create({
            header: (title) ? this.i18n.get(title, title) : null,
            message: this.i18n.get(message, message),
            color: "success",
            animated:true,
            duration: 2000
        });
        toast.present();
    }

    async error(message: string, title: string = null) {
        const toast = await this.toastController.create({
            header: (title) ? this.i18n.get(title, title) : null,
            message: this.i18n.get(message, message),
            color: "danger",
            animated:true,
            duration: 2000
        });
        toast.present();
    }

    // public confirm(message: string, title: string, yes: string, no: string): Promise<boolean> {
    //     return new Promise<boolean>((resolve) => {
    //         const dialogRef = this.dialog.open(ConfirmDialog, {
    //             closeOnNavigation: true,
    //             data: {message: message, title: title, yes: yes, no: no}
    //         });

    //         dialogRef.afterClosed().subscribe(result => {
    //             resolve(result);
    //             return result;
    //         });
    //     })
    // }

}