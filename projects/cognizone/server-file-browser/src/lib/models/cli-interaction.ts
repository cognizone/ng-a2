export type CliInteraction = {
  isCommand: boolean;
  value: string | string[]
};

export function isCliInteraction(object: unknown): object is CliInteraction {
  return (object as CliInteraction).isCommand !== undefined;
}
