import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-are-you-sure',
  templateUrl: './are-you-sure.component.html',
  styleUrls: ['./are-you-sure.component.scss'],
  standalone: false,
})
export class AreYouSureComponent {
  data = inject<{ header?: string; text?: string; cancel: string; execute: string }>(MAT_DIALOG_DATA);
}
