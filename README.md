# ng-a2

Monorepo for Cognizone Angular libraries, published to npm.

## Angular version compatibility

| Library version | Angular requirement |
| --------------- | ------------------- |
| `1.1.x`         | Angular >= 20       |
| `2.0.x`         | Angular >= 21       |

## Published packages

| Package                                                                                  | Latest version |
| ---------------------------------------------------------------------------------------- | -------------- |
| [`@cognizone/a2-core`](https://www.npmjs.com/package/@cognizone/a2-core)                 | 2.0.0          |
| [`@cognizone/a2-ui`](https://www.npmjs.com/package/@cognizone/a2-ui)                     | 2.0.0          |
| [`@cognizone/a2-sse`](https://www.npmjs.com/package/@cognizone/a2-sse)                   | 2.0.0          |
| [`@cognizone/a2-tree-browser`](https://www.npmjs.com/package/@cognizone/a2-tree-browser) | 2.0.0          |

## Use in the apps

Install a library as in example: `npm i @cognizone/a2-ui`

For apps on **Angular 20**, pin to `1.x.x`: `npm i @cognizone/a2-ui@1.x.x`

## Reports of testing

### Cypress E2E tests

```bash
npm run cypress:run:report
```

in the folder cypress, index.html file will be created

### Unit tests

```bash
npm run test:coverage:open
```

the report will open in the browser
