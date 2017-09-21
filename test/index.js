var assert = require('assert');
var express = require('express');
var http = require('http');
var openInEditor = require('../index.js');
var PORT = process.env.PORT || 8999;
var OPEN_FILE = 'echo';

process.env.OPEN_FILE = OPEN_FILE;

function request(options, expectedStatusCode, expectedResponse, done) {
    return function(done) {
        http.request(Object.assign({
            hostname: 'localhost',
            port: PORT,
            method: 'GET'
        }, options), function(res) {
            var actualResponse = '';

            assert.equal(res.statusCode, expectedStatusCode);

            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                actualResponse += chunk;
            });
            res.on('end', function() {
                if (typeof expectedResponse === 'string') {
                    assert.equal(actualResponse, expectedResponse);
                } else {
                    assert(expectedResponse.test(actualResponse), 'should match to ' + expectedResponse);
                }
                done();
            });
        }).end();
    };
}

describe('app.use(middleware)', function() {
    var server;
    var app;
    var tests = [
        [{ path: '/any?file=foo' }, 200, 'OK'],
        [{ path: '/any?file=foo', method: 'POST' }, 200, 'OK'],
        [{ path: '/any?filex=foo' }, 400, '[express-open-in-editor] Parameter missed: file']
    ];

    beforeEach(function(done) {
        app = express();
        app.use(openInEditor());
        server = app.listen(PORT, function() {
            done();
        });
    });
    afterEach(function() {
        server.close();
    });

    tests.forEach(function(test) {
        var options = test[0];
        var statusCode = test[1];
        var response = test[2];

        it([
            options.method || 'GET',
            options.path
        ].join(' '), request(options, statusCode, response));
    });
});

describe('app.use("path", middleware)', function() {
    var server;
    var app;
    var tests = [
        [{ path: '/test?file=foo' }, 200, 'OK'],
        [{ path: '/test?file=foo', method: 'POST' }, 200, 'OK'],
        [{ path: '/test?filex=foo' }, 400, '[express-open-in-editor] Parameter missed: file'],
        [{ path: '/?file=foo' }, 404, /Cannot GET \//],
        [{ path: '/xx?file=foo' }, 404, /Cannot GET \/xx/]
    ];

    beforeEach(function(done) {
        app = express();
        app.use('/test', openInEditor());
        server = app.listen(PORT, function() {
            done();
        });
    });
    afterEach(function() {
        server.close();
    });

    tests.forEach(function(test) {
        var options = test[0];
        var statusCode = test[1];
        var response = test[2];

        it([
            options.method || 'GET',
            options.path
        ].join(' '), request(options, statusCode, response));
    });
});

describe('app.get("path", middleware)', function() {
    var server;
    var app;
    var tests = [
        [{ path: '/test?file=foo' }, 200, 'OK'],
        [{ path: '/test?file=foo', method: 'POST' }, 404, /Cannot POST \/test/],
        [{ path: '/test?filex=foo' }, 400, '[express-open-in-editor] Parameter missed: file'],
        [{ path: '/?file=foo' }, 404, /Cannot GET \//],
        [{ path: '/xx?file=foo' }, 404, /Cannot GET \/xx/]
    ];

    beforeEach(function(done) {
        app = express();
        app.get('/test', openInEditor());
        server = app.listen(PORT, function() {
            done();
        });
    });
    afterEach(function() {
        server.close();
    });

    tests.forEach(function(test) {
        var options = test[0];
        var statusCode = test[1];
        var response = test[2];

        it([
            options.method || 'GET',
            options.path
        ].join(' '), request(options, statusCode, response));
    });
});

describe('bad configure', function() {
    var server;
    var app;
    var originalWarn = console.warn;
    var warns = [];

    console.warn = function() {
        warns.push([].slice.call(arguments));
    };

    beforeEach(function(done) {
        app = express();
        app.use(openInEditor({ editor: 'xxx' }));
        server = app.listen(PORT, function() {
            done();
        });
    });
    afterEach(function() {
        assert.deepEqual(warns, [
            ['[express-open-in-editor] Configure error:', 'Wrong value for `editor` option: xxx'],
            ['[express-open-in-editor] Request to open file failed, editor is not set up']
        ]);
        console.warn = originalWarn;
        server.close();
    });

    it('request should fail', request({ path: '/test?file=foo' }, 400, '[express-open-in-editor] Request to open file failed, editor is not set up'));
});

describe('bad command', function() {
    var server;
    var app;

    beforeEach(function(done) {
        app = express();
        process.env.OPEN_FILE = 'xxx';
        app.use(openInEditor());
        process.env.OPEN_FILE = OPEN_FILE;
        server = app.listen(PORT, function() {
            done();
        });
    });
    afterEach(function() {
        server.close();
    });

    it('request to server with bad command should fail', request({ path: '/test?file=foo' }, 500, /ERROR: Error: Command failed: "xxx" "\/foo:1:1"/));
});
