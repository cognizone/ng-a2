# A2 Sse (Server Side Events)

[See MDN's official SSE documentation for further details.](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

## Setting up

- Install the package with `npm install @cognizone/a2-sse @cognizone/model-utils`
- Provide the `SseWrapperFactory` service into the module where you'll use the SSE functionality (in the `providers` array)
- Create a handler service to communicate with the sse functionality, e.g. `log-listener.service.ts`

Inside that service;

```
// import the Sse wrapper classes
import { SseWrapper, SseWrapperFactory } from '@cognizone/a2-sse';
```

```
// define an instance of sseWrapper
private sseWrapper: SseWrapper<string>;

// inject the SseWrapperFactory class
constructor(private readonly sseWrapperFactory: SseWrapperFactory, ...) {}
```

You'll need to create an instance of `sseWrapper` and initialize it. Internally, it will establish the sse connection.

```
triggerSseConnection(): void {
  const uri = 'http:your-sse-api-endpoint';

  this.sseWrapper = this.sseWrapperFactory.create<string>(uri);
  this.sseWrapper.init();
}
```

You can also pass in a second parameter to the `create` method, which is an optional configuration object of the following blueprint:

```
{
  eventSourceInit: {
    withCredentials: boolean // (defaults to true)
  }
}
```

## Example usage:

Once you've initialized the sseWrapper instance, you can listen to

- the reconnection state of the SSE connection (`this.sseWrapper.open$`)
- the ready state of the connection (`this.sseWrapper.readyState$`)
- the errors thrown from the connection (`this.sseWrapper.error$`)
- the "message" typed events of the connection (`this.sseWrapper.message$`)

using the above-mentioned observable values.

The SseWrapper supports custom event types, too:

```
  listenToMessages(): Observable<MessageEvent<string>> {
    // listen to "message", "myCustomType1" and "myCustomType2" type events
    // together
    const messages$ = merge(
      this.sseWrapper.message$,
      this.sseWrapper.getEventsOfTypes(['myCustomType1', 'myCustomType2']),
    );

    // or separately

    const messages$ = merge(
      this.sseWrapper.message$,
      this.sseWrapper.getEventsOfTypes('myCustomType1'),
      this.sseWrapper.getEventsOfTypes('myCustomType2')
    );

    return messages$
      .pipe(
        // do your thing
      );
  }
```

When you'd like to close your connection, you can use the `.close()` function of the SseWrapper:

```
  closeSseConnection(): void {
    this.sseWrapper.close();
    this.resetStoredLogs();
  }
```

---

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.4.

## Code scaffolding

Run `ng generate component component-name --project a2-sse` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project a2-sse`.

> Note: Don't forget to add `--project a2-sse` or else it will be added to the default project in your `angular.json` file.

## Build

Run `npm run build:a2-sse` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test a2-sse` to execute the unit tests via [Jest](https://jestjs.io/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Key Features

- **SSE Wrapper Factory**: Factory service for creating EventSource wrappers
- **Event Source Management**: Observable-based event handling for connection state, messages, and errors
- **Custom Event Types**: Support for listening to custom event types in addition to standard message events
