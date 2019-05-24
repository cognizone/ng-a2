import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractLimitIncreaseComponent, AbstractNodeTemplateComponent } from './abstract-node-template.component';

@Component({
  selector: 'tb-default-node-template',
  template: `
    @if (nodeWrapper.isRoot()) {
      <div>
        Root
        <div style="margin-left: 10px">
          <tb-internal-children-template [nodeWrapper]="nodeWrapper" [internalTemplate]="internalTemplate"></tb-internal-children-template>
        </div>
      </div>
    }
    @if (!nodeWrapper.isRoot()) {
      <div>
        Node #{{ nodeWrapper.index }}
        @if (nodeWrapper.hasChildren()) {
          <button (click)="toggle()">{{ collapsed ? 'expand' : 'collapse' }}</button>
        }
        @if (!collapsed) {
          <div style="margin-left: 10px">
            <tb-internal-children-template
              [nodeWrapper]="nodeWrapper"
              [internalTemplate]="internalTemplate"
            ></tb-internal-children-template>
          </div>
        }
      </div>
    }
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
