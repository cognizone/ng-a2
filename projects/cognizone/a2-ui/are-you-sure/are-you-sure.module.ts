import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreYouSureComponent } from './are-you-sure.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AreYouSureComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [AreYouSureComponent],
})
export class AreYouSureModule {}
