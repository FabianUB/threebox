'use strict';
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var baseDirectory = __dirname; 
var port = process.env.PORT || 8080;
var target = process.env.TB_TARGET || 'legacy';
var distRoot = path.join(__dirname, 'dist');
var bundleFiles = {
    legacy: {
        script: 'threebox.js',
        style: 'threebox.css'
    },
    modern: {
        script: 'threebox.js',
        style: 'threebox.css'
    }
};
var counter = 0;

http.createServer(function (request, response) {
    try {
        var requestUrl = url.parse(request.url);
        // need to use path.normalize so people can't access directories underneath baseDirectory
        var fsPath = baseDirectory + path.normalize(requestUrl.pathname);

        var ext = path.extname(fsPath)
        var validExtensions = {
            ".html": "text/html",
            ".js": "application/javascript",
            ".json": "application/json",
            ".geojson": "application/json",
            ".bin": "application/octet-stream",
            ".css": "text/css",
            ".txt": "text/plain",
            ".bmp": "image/bmp",
            ".jpg": "image/jpeg",
            ".gif": "image/gif",
            ".png": "image/png",
            ".ico": "image/x-icon",
            ".dae": "application/vnd.oipf.dae.svg+xml",
            ".pbf": "application/octet-stream",
            ".mtl": "model/mtl",
            ".obj": "model/obj",
            ".glb": "model/gltf-binary",
            ".gltf": "model/gltf+json",
            ".fbx": "application/octet-stream",
            ".ttf": "application/octet-stream",
            ".woff": "font/woff",
            ".woff2": "font/woff2",

        };

        var isValidExt = validExtensions[ext];

        if (requestUrl.pathname === '/threebox-target.js') {
            var bundle = bundleFiles[target] || bundleFiles.legacy;
            var content = `
                window.__THREEBOX_TARGET__ = '${target}';
                window.__THREEBOX_SCRIPT__ = '${bundle.script}';
                window.__THREEBOX_STYLE__ = '${bundle.style}';
            `;
            response.setHeader("Content-Type", "application/javascript");
            response.writeHead(200);
            response.end(content);
            return;
        }

        var fileStream = fs.createReadStream(fsPath);
        fileStream.pipe(response);
        fileStream.on('open', function () {
            response.setHeader("Content-Type", validExtensions[ext]);
            response.writeHead(200);
        });
        fileStream.on('error', function (e) {
            response.writeHead(404);    // assume the file doesn't exist
            response.end();
        });
    } catch (e) {
        response.writeHead(500);
        response.end();    // end the response so browsers don't hang
        console.log(e.stack);
    }

}).listen(port, function(){
    console.log(`Threebox examples dev server running on http://localhost:${port} (target=${target})`);
});
