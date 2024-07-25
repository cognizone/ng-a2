import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreYouSureComponent } from './are-you-sure.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [AreYouSureComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatLegacyButtonModule
  ],
  exports: [AreYouSureComponent]
})
export class AreYouSureModule {}
