import { Component, inject } from '@angular/core';
import { SimpleSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alert-snack',
  templateUrl: './alert-snack.component.html',
  styleUrls: ['./alert-snack.component.scss'],
  standalone: false,
})
export class AlertSnackComponent {
  data = inject<{ message: string; dismissible: boolean }>(MAT_SNACK_BAR_DATA);
  private snackBarRef = inject(MatSnackBarRef<SimpleSnackBar>);
  message: string;
  dismissible: boolean;

  constructor() {
    this.message = this.data.message;
    this.dismissible = this.data.dismissible;
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
