import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractLimitIncreaseComponent, AbstractNodeTemplateComponent } from './abstract-node-template.component';

@Component({
  selector: 'tb-default-node-template',
  template: `
    <div *ngIf="nodeWrapper.isRoot()">
      Root
      <div style="margin-left: 10px">
        <tb-internal-children-template [nodeWrapper]="nodeWrapper" [internalTemplate]="internalTemplate"></tb-internal-children-template>
      </div>
    </div>
    <div *ngIf="!nodeWrapper.isRoot()">
      Node #{{ nodeWrapper.index }}
      <button *ngIf="nodeWrapper.hasChildren()" (click)="toggle()">{{ collapsed ? 'expand' : 'collapse' }}</button>

      <div style="margin-left: 10px" *ngIf="!collapsed">
        <tb-internal-children-template [nodeWrapper]="nodeWrapper" [internalTemplate]="internalTemplate"></tb-internal-children-template>
      </div>
    </div>
  `,
  standalone: false,
})
export class DefaultNodeTemplateComponent extends AbstractNodeTemplateComponent<any> {
  collapsed = true;

  constructor(private ref: ChangeDetectorRef) {
    super();
  }

  toggle() {
    this.collapsed = !this.collapsed;
    this.ref.detectChanges();
  }
}

@Component({
  selector: 'tb-default-limit-increase',
  template: ` <button (click)="clickAction()">See more</button> `,
  standalone: false,
})
export class DefaultLimitIncreaseComponent extends AbstractLimitIncreaseComponent {}
