import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-are-you-sure',
  templateUrl: './are-you-sure.component.html',
  styleUrls: ['./are-you-sure.component.scss'],
})
export class AreYouSureComponent {
  text: string;
  cancel: string;
  execute: string;

  constructor(
    public readonly dialogRef: MatDialogRef<AreYouSureComponent>,
    @Inject(MAT_DIALOG_DATA) data: { text: string; cancel: string; execute: string }
  ) {
    this.text = data.text;
    this.cancel = data.cancel;
    this.execute = data.execute;
  }

  click(confirmed: boolean) {
    this.dialogRef.close(confirmed);
  }
}
