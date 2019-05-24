import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertSnackComponent } from './alert-snack.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [AlertSnackComponent],
  imports: [CommonModule, RouterModule, MatSnackBarModule, MatIconModule],
  exports: [AlertSnackComponent],
})
export class GlobalAlertModule {}
