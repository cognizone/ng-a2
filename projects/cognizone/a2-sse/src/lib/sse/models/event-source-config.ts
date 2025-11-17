import { InjectionToken } from '@angular/core';

export interface EventSourceConfig {
  eventSourceInit?: EventSourceInit;
}

export const defaultEventSourceConfig: EventSourceConfig = {
  eventSourceInit: {
    withCredentials: true,
  },
};

export const DEFAULT_EVENT_SOURCE_CONFIG = new InjectionToken('DEFAULT_EVENT_SOURCE_CONFIG', {
  factory: () => defaultEventSourceConfig,
});
