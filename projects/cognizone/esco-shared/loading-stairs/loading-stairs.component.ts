import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'esco-loading-stairs',
  templateUrl: './loading-stairs.component.html',
  styleUrls: ['./loading-stairs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStairsComponent {
  @Input() message: string;
}
