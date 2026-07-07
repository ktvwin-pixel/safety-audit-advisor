const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4197);
const host = process.env.HOST || "0.0.0.0";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const target = path.join(root, decoded === "/" ? "index.html" : decoded);
  return target.startsWith(root) ? target : null;
}

http
  .createServer((req, res) => {
    const file = safePath(req.url);
    if (!file) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-cache"
      });
      res.end(data);
    });
  })
  .listen(port, host, () => {
    console.log(`Safety Audit Advisor running at http://127.0.0.1:${port}/`);
    console.log(`For phones or another PC on the same network, open http://<this-PC-IP>:${port}/`);
  });
