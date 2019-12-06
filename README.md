# A2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

## Using dev code in project environment

You might want to use he code of this library directly in your project before making a new release, for that you have 2 solutions

### Using npm link for direct source usage

```bash
cd ./projects/cognizone/a2
npm link
cd /path/to/my/project/frontend/root
npm link @cognizone/a2
```

With this, the installed dependency of @cognizone/a2 will be replaced a symlink to the source present here. But keep in mind:

- you are directly targeting the source, so the code will be transpilled using your project config, so you might have errors
- do not commit the changes made to package.json and package-lock.json made by the npm link

When you are finished, you can run the next command line in your project root

```bash
npm unlink @cognizone/a2
```

### Changing "dest"

in `projects/cognizone/a2/ng-package.json`, there is the `dest` attribute, you can change this path to something like `/path/to/my/project/frontend/root/node_modules/@cognizone/a2`. After that you can run

```bash
npm run build -- --watch
```

and then in you can run `npm start` in your project repository.
