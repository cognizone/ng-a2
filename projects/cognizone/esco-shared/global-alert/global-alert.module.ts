import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertSnackComponent } from './alert-snack.component';
import { GlobalAlertService } from './global-alert.service';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

@NgModule({
  declarations: [AlertSnackComponent],
  imports: [CommonModule, RouterModule, MatSnackBarModule, MatIconModule],
  providers: [GlobalAlertService],
})
export class GlobalAlertModule {}
