Express extension to open file in editor.

## Install

```
npm install open-in-editor
```

## Usage

```js
var express = require('express');
var openInEditor = require('express-open-in-editor');

var app = express();

app.use(openInEditor());

// ...
```

After that you can use GET requests like `/open-in-editor?file=foo/bar.ext:2:5` to open `foo/bar.ext` in editor at line 2 column 5.

By default extension uses `process.env.VISUAL` or `process.env.EDITOR` (with this priority) to get command to open file in editor. It could be set globally or with main script:

```
EDITOR=subl node app.js
```

Also you can set `process.env.OPEN_FILE`, that has highest priority and could detect editor command to launch by it's short name (i.e. `subl` for `Sublime Text` or `atom` for `Atom Editor`).

More details about editor setup see in [open-in-editor](https://github.com/lahmatiy/open-in-editor).

## API

```
openInEditor([options]);
```

### options

#### url

Type: `String`
Default: `/open-in-editor`

Listen path.

#### other options

Other options is apply as-is to [open-in-editor](https://github.com/lahmatiy/open-in-editor).

## License

MIT
