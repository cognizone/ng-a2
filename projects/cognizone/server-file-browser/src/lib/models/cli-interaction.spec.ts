import { CliInteraction, isCliInteraction } from "./cli-interaction";

describe('CliInteraction', () => {
  describe('isCliInteraction', () => {
    it('should determine whether an object is of type CliInteraction or not', () => {
      const truthyCase_input: CliInteraction = { isCommand: true, value: "ls" };
      const truthyCase_expected = true;
      const truthyCase_actual = isCliInteraction(truthyCase_input);

      const falsyCase_input: {} = {};
      const falsyCase_expected = false;
      const falsyCase_actual = isCliInteraction(falsyCase_input);

      expect(truthyCase_actual).toEqual(truthyCase_expected);
      expect(falsyCase_actual).toEqual(falsyCase_expected);
    })
  })
})
