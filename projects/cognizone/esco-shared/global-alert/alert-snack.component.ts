import { Component, Inject } from '@angular/core';
import { SimpleSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alert-snack',
  templateUrl: './alert-snack.component.html',
  styleUrls: ['./alert-snack.component.scss'],
  standalone: false,
})
export class AlertSnackComponent {
  message: string;
  dismissible: boolean;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string; dismissible: boolean },
    private snackBarRef: MatSnackBarRef<SimpleSnackBar>
  ) {
    this.message = data.message;
    this.dismissible = data.dismissible;
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
