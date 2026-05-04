// Regression guard for TDZ in @cognizone/ng-core's FESM bundle (circular import → "Cannot access 'LoggerFactory' before initialization").
import { OnDestroy$ } from '@cognizone/ng-core';

describe('@cognizone/ng-core bundle', () => {
  it('evaluates without TDZ errors', () => {
    expect(OnDestroy$).toBeDefined();
  });
});
