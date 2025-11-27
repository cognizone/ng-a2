import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { SseWrapperFactory, SseWrapper } from './sse-wrapper-factory.service';
import { DEFAULT_EVENT_SOURCE_CONFIG, EventSourceConfig } from '../models/event-source-config';

const CONNECTING = 0;
const CLOSED = 2;

class MockEventSource {
  readyState: number = CONNECTING;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onopen: (() => void) | null = null;

  constructor(
    public url: string,
    public eventSourceInit?: EventSourceInit
  ) {}

  addEventListener(_type: string, _handler: (event: MessageEvent) => void): void {}

  close(): void {
    this.readyState = CLOSED;
  }
}

describe('SseWrapperFactory', () => {
  let service: SseWrapperFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DEFAULT_EVENT_SOURCE_CONFIG, useValue: { eventSourceInit: { withCredentials: true } } }],
    });
    service = TestBed.inject(SseWrapperFactory);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Wrapper Creation', () => {
    it('create should return SseWrapper instance', () => {
      const wrapper = service.create('http://test-url');
      expect(wrapper).toBeInstanceOf(SseWrapper);
    });
  });
});

describe('SseWrapper', () => {
  let ngZone: NgZone;
  let mockEventSource: MockEventSource;
  let config: EventSourceConfig;

  beforeEach(() => {
    ngZone = new NgZone({ enableLongStackTrace: false });
    config = { eventSourceInit: { withCredentials: true } };
    mockEventSource = new MockEventSource('http://test-url');

    const mockEventSourceConstructor = jest.fn().mockImplementation((_url: string, _options?: EventSourceInit) => {
      return mockEventSource;
    });
    Object.assign(mockEventSourceConstructor, { CONNECTING, CLOSED });
    (global as unknown as Record<string, unknown>).EventSource = mockEventSourceConstructor;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('init should initialize EventSource', () => {
      const wrapper = new SseWrapper('http://test-url', ngZone, config);
      wrapper.init();
      expect(EventSource).toHaveBeenCalledWith('http://test-url', config.eventSourceInit);
    });
  });

  describe('Message Handling', () => {
    it('message$ should emit when EventSource receives message', done => {
      const wrapper = new SseWrapper('http://test-url', ngZone, config);
      wrapper.init();

      const testMessage = new MessageEvent('message', { data: 'test data' });
      wrapper.message$.subscribe(message => {
        expect(message).toBe(testMessage);
        done();
      });

      if (mockEventSource.onmessage) {
        mockEventSource.onmessage(testMessage);
      }
    });
  });

  describe('Connection Management', () => {
    it('close should close EventSource', () => {
      const wrapper = new SseWrapper('http://test-url', ngZone, config);
      wrapper.init();
      const closeSpy = jest.spyOn(mockEventSource, 'close');

      wrapper.close();
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
