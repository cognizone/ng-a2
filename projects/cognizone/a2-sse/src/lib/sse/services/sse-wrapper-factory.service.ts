import { inject, Injectable, NgZone } from '@angular/core';
import { Many, manyToArray } from '@cognizone/model-utils';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

import { DEFAULT_EVENT_SOURCE_CONFIG, EventSourceConfig } from '../models/event-source-config';

@Injectable({ providedIn: 'root' })
export class SseWrapperFactory {
  private readonly ngZone = inject(NgZone);
  private readonly defaultConfig = inject(DEFAULT_EVENT_SOURCE_CONFIG);

  create<T>(url: string, options: EventSourceConfig = this.defaultConfig): SseWrapper<T> {
    return new SseWrapper<T>(url, this.ngZone, options);
  }
}

export class SseWrapper<T> {
  get message$(): Observable<MessageEvent<T>> {
    return this._message$.asObservable();
  }

  get error$(): Observable<Event> {
    return this._error$.asObservable();
  }

  get open$(): Observable<void> {
    return this._open$.asObservable();
  }

  get readyState$(): Observable<number> {
    return this._readyState$.asObservable();
  }

  private _message$: Subject<MessageEvent<T>> = new Subject();
  private _error$: Subject<Event> = new Subject();
  private _open$: Subject<void> = new Subject();
  private _readyState$: BehaviorSubject<number>;

  private eventSource: EventSource;

  private eventTypeMap: { [eventType: string]: Observable<MessageEvent<T>> } = {};

  constructor(
    private url: string,
    private ngZone: NgZone,
    private options: EventSourceConfig
  ) {}

  init(): void {
    this.eventSource = new EventSource(this.url, this.options.eventSourceInit);
    this._readyState$ = new BehaviorSubject(this.eventSource.readyState);

    this.eventSource.onmessage = messageEvent => {
      this.ngZone.run(() => {
        this._message$.next(messageEvent);
        this.updateReadyState();
      });
    };

    this.eventSource.onerror = error => {
      this.ngZone.run(() => {
        this._error$.next(error);
        this.updateReadyState();
      });
    };

    this.eventSource.onopen = () => {
      this._open$.next();
      this.ngZone.run(() => this.updateReadyState());
    };
  }

  close(): void {
    this.eventSource.close();
    this.updateReadyState();
  }

  /**
   * @param eventType: One or more event types to keep track of.
   */
  getEventsOfTypes(eventType: Many<string>): Observable<MessageEvent<T>> {
    const allObs$: Observable<MessageEvent<T>>[] = manyToArray(eventType).map(type => {
      if (this.eventTypeMap[type]) return this.eventTypeMap[type];

      return (this.eventTypeMap[type] = new Observable(subscriber => {
        const messageEventHandler = (messageEvent: MessageEvent) => {
          this.ngZone.run(() => {
            subscriber.next(messageEvent);
            this.updateReadyState();
          });
        };

        this.eventSource.addEventListener(type, messageEventHandler);
        subscriber.add(
          this.readyState$.subscribe(state => {
            if (state === EventSource.CLOSED) subscriber.complete();
          })
        );
      }).pipe(share<MessageEvent<T>>()));
    });

    return merge(...allObs$);
  }

  private updateReadyState(): void {
    if (this.eventSource.readyState !== this._readyState$.value) {
      this._readyState$.next(this.eventSource.readyState);
    }

    if (this.eventSource.readyState === EventSource.CLOSED) {
      this._message$.complete();
      this._error$.complete();
      this._readyState$.complete();
    }
  }
}
