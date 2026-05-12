const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const filePath = path.join('.', req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            const ext = path.extname(filePath);
            const contentType = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css'
            }[ext] || 'text/plain';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(3000, '127.0.0.1', () => console.log('Server running at http://localhost:3000'));
