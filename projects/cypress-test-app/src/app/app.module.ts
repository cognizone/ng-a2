import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';

// Import all library modules for testing
import { LoadingStairsModule } from '../../../cognizone/a2-ui/loading-stairs/loading-stairs.module';
import { AreYouSureModule } from '../../../cognizone/a2-ui/are-you-sure/are-you-sure.module';
import { GlobalAlertModule } from '../../../cognizone/a2-ui/global-alert/global-alert.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    LoadingStairsModule,
    AreYouSureModule,
    GlobalAlertModule,
  ],
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
  bootstrap: [AppComponent],
})
export class AppModule {}
