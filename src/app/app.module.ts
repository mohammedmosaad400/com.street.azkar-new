import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AllMaterialModules } from './all-material-modules';
import { HomePage } from './home/home.page';
import { I18NFieldPipe } from './providers/i18n.field.pipe';
import { I18NPipe } from './providers/i18n.pipe';
import { I18N } from './providers/i18n.provider';
import { DataProvider } from './providers/DataProvider';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import ar from '@angular/common/locales/ar';
import { PoultryRobotComponent } from './shelve/poultry-robot/poultry-robot.component';
import { MenuComponent } from './shelve/menu/menu.component';
import { AgeCalculatorComponent } from './shelve/age-calculator/age-calculator.component';
import { RewardedAdConfirmComponent } from './common/rewarded-ad-confirm/rewarded-ad-confirm.component';

registerLocaleData(ar);
const routes: Routes = [
  { path: 'home', component: HomePage, resolve: { constants: DataProvider } },
  { path: 'menu', component: MenuComponent, resolve: { constants: DataProvider } },
  { path: 'age-calculator', component: AgeCalculatorComponent, resolve: { constants: DataProvider } },
  { path: 'robot', component: PoultryRobotComponent, resolve: { constants: DataProvider } },

  { path: '', redirectTo: 'login', pathMatch: 'full', resolve: { constants: DataProvider } },
  { path: '**', redirectTo: '/home', resolve: { constants: DataProvider } },
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    I18NPipe,
    I18NFieldPipe,
    AppComponent,
    HomePage,
    PoultryRobotComponent,
    MenuComponent,
    AgeCalculatorComponent,
    RewardedAdConfirmComponent
  ],
  imports: [
    // provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    // provideFirestore(() => getFirestore()),    
    BrowserModule,
    IonicModule.forRoot(),
    CommonModule,
    AllMaterialModules,
    HttpClientModule,
    // NgxBarcodeModule,
    AngularEditorModule,
    ClipboardModule,
    // SmartPdfModule
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule,
    HttpClientJsonpModule
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFireDatabaseModule,
    // AngularFireStorageModule
  ],

  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'ar' },
    { provide: LOCALE_ID, useValue: 'ar'},
    DataProvider,
    I18N,
    DatePipe,
    // FileUploadService,
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }