import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractNodeTemplateComponent } from './abstract-node-template.component';

@Component({
  selector: 'tb-internal-children-template',
  template: ` <ng-container *ngTemplateOutlet="internalTemplate; context: { nodeWrapper: nodeWrapper }"></ng-container> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalChildrenTemplateComponent<T> extends AbstractNodeTemplateComponent<T> {}
