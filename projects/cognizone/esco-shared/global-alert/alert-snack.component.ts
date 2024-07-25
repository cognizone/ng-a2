import { Component, Inject } from '@angular/core';
import {
  LegacySimpleSnackBar as SimpleSnackBar,
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
  MatLegacySnackBarRef as MatSnackBarRef,
} from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-alert-snack',
  templateUrl: './alert-snack.component.html',
  styleUrls: ['./alert-snack.component.scss'],
})
export class AlertSnackComponent {
  message: string;
  dismissible: boolean;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<SimpleSnackBar>
  ) {
    this.message = data.message;
    this.dismissible = data.dismissible;
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
