import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertSnackComponent } from './alert-snack.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

@NgModule({
  declarations: [AlertSnackComponent],
  imports: [CommonModule, RouterModule, MatSnackBarModule, MatIconModule],
  exports: [AlertSnackComponent],
})
export class GlobalAlertModule {}
