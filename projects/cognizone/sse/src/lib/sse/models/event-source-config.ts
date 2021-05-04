export interface EventSourceConfig {
  withCredentials: boolean;
}

export const defaultEventSourceConfig: EventSourceConfig = {
  withCredentials: false,
};
