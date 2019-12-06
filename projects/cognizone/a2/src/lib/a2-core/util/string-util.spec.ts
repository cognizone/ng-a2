import { StringUtil } from "./string-util";

describe("StringUtil", () => {
  test("isUpper", () => {
    expect(StringUtil.isUpper("LABEL")).toBeTruthy();
    expect(StringUtil.isUpper("LABEl")).toBeFalsy();
    expect(StringUtil.isUpper("BLA bla")).toBeFalsy();
  });
});
