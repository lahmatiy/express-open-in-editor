[![NPM version](https://img.shields.io/npm/v/express-open-in-editor.svg)](https://www.npmjs.com/package/express-open-in-editor)
[![Dependency Status](https://img.shields.io/david/lahmatiy/express-open-in-editor.svg)](https://david-dm.org/lahmatiy/express-open-in-editor)

Express middleware to open any file in an editor by request to defined route. Based on [open-in-editor](https://github.com/lahmatiy/open-in-editor).

## Install

```
npm install express-open-in-editor
```

## Usage

```js
var express = require('express');
var openInEditor = require('express-open-in-editor');

var app = express();

// There are few ways to setup:
// - to trigger middleware on *GET* request to `/open-in-editor`
app.get('/open-in-editor', openInEditor());

// - to trigger middleware on *any* request method to `/open-in-editor`
app.use('/open-in-editor', openInEditor());

// - to trigger middleware on *any* request method to *any* path
//   (not recomended unless server's single purpose is to open files in editor)
app.use(openInEditor());
```

After that you can use GET requests like `/open-in-editor?file=foo/bar.ext:2:5` to open `foo/bar.ext` in an editor at line 2 column 5.

By default `express-open-in-editor` uses `process.env.VISUAL` or `process.env.EDITOR` (with this priority) to define the command to open a file in an editor. It could be set globally or on script execution:

```
EDITOR=subl node app.js
```

Also you can set `process.env.OPEN_FILE` that has highest priority and understands shorthands (i.e. `subl` for `Sublime Text` or `atom` for `Atom Editor`).

For more details about setup see [open-in-editor](https://github.com/lahmatiy/open-in-editor) description.

### Using with webpack-dev-server

Although `webpack-dev-server` uses `express` to create a server, you have the same options to apply the middleware to it. The only difference is that you should define it in `setup` method (see [issue](https://github.com/webpack/webpack-dev-server/issues/285) for details).

```js
var server = new WebpackDevServer(webpack(config), {
  // ...
  setup: function(app) {
    app.use('/open-in-editor', openInEditor());
  }
});
```

## API

```
openInEditor([options]);
```

Options are optional and passes to [open-in-editor](https://github.com/lahmatiy/open-in-editor) as is.

## Related projects

- [open-in-editor](https://github.com/lahmatiy/open-in-editor) – package that do the main task of `express-open-in-editor`, i.e. opens file in editor.
- [babel-plugin-source-wrapper](https://github.com/restrry/babel-plugin-source-wrapper) – `Babel` plugin that instruments source code to associate objects with location they defined in code base.
- [Component Inspector](https://github.com/lahmatiy/component-inspector) – developer tool to inspect components that can open component creation source location in editor. Has integrations for `React`, `Backbone` and can be adopter for other frameworks.

## License

MIT
