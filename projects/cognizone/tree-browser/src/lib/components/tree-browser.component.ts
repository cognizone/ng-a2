import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NodeWrapper } from '../model/node-wrapper';
import { TreeModel } from '../model/tree-model';
import { Observable } from 'rxjs';
import { OnDestroy$ } from '@cognizone/ng-core';

@Component({
  selector: 'tb-tree-browser',
  template: `
    <tb-tree-node
      #root
      [nodeWrapper]="wrap()"
      [nodeTemplate]="nodeTemplate ? nodeTemplate : defaultNodeTemplate"
      [treeModel]="treeModel"
      [childLimit]="childLimit"
      [childLimitIncreaseAmount]="childLimitIncreaseAmount"
      [limitIncreaseTemplate]="limitIncreaseTemplate ? limitIncreaseTemplate : defaultLimitIncrease"
      [refreshEvents$]="refreshEvents$"
    >
    </tb-tree-node>

    <ng-template #defaultNodeTemplate let-nodeWrapper="nodeWrapper" let-internalTemplate="internalTemplate">
      <tb-default-node-template [nodeWrapper]="nodeWrapper" [internalTemplate]="internalTemplate"></tb-default-node-template>
    </ng-template>

    <ng-template #defaultLimitIncrease let-clickAction="clickAction">
      <tb-default-limit-increase [clickAction]="clickAction"></tb-default-limit-increase>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeBrowserComponent<T> extends OnDestroy$ implements AfterViewInit, OnInit {
  @Input() refreshEvents$: Observable<TreeModel<T>> = new Observable();
  @Input() childLimit = Number.MAX_SAFE_INTEGER;
  @Input() childLimitIncreaseAmount = 0;

  @Input() treeModel: TreeModel<T>;

  @Input() nodeTemplate: TemplateRef<any>;
  @Input() limitIncreaseTemplate: TemplateRef<any>;

  constructor(private readonly ref: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit(): void {
    this.ref.detach();
  }

  wrap() {
    return new NodeWrapper<T>(this.treeModel.getRoot(), 0, this.treeModel, this.childLimit, 1, true);
  }

  ngOnInit(): void {
    this.subSink = this.refreshEvents$.subscribe(t => {
      this.treeModel = t;
      this.ref.detectChanges();
    });
  }
}
