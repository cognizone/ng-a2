import { Directive, Input, OnInit, TemplateRef } from '@angular/core';
import { NodeWrapper } from '../model/node-wrapper';
import { OnDestroy$ } from '@cognizone/ng-core';

@Directive()
export abstract class AbstractNodeTemplateComponent<T> extends OnDestroy$ implements OnInit {
  @Input() nodeWrapper: NodeWrapper<T>;
  @Input() internalTemplate: TemplateRef<any>;
  node: T;

  ngOnInit() {
    this.node = this.nodeWrapper.node;
  }
}

@Directive()
export abstract class AbstractLimitIncreaseComponent {
  @Input() clickAction: () => void;
}
