// IMPORTS
require('dotenv').config();
const log = console.log;
const logger = require('./logger');
const fs = require('fs');
const path = require('path');
const http = require('http');
const server = http.createServer;
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const EventEmitter = require('events');
// INITIALIZING EVENT EMITTER
const Emitter = new EventEmitter();
Emitter.on('log', (message, file_name) => logger(message, file_name));
server((req, res) => {
    Emitter.emit('log', `${req.url}\t${req.method}`, 'requests');
    // VARIABLES
    let file_ext = path.extname(req.url), content_type;
    // CHECKING CONTENT TYPES
    if (file_ext === '.css') {
        content_type = 'text/css';
    } else if (file_ext === '.js') {
        content_type = 'text/javascript';
    } else if (file_ext === '.json') {
        content_type = 'application/json';
    } else if (file_ext === '.jpg') {
        content_type = 'image/jpeg';
    } else if (file_ext === '.png') {
        content_type = 'image/png';
    } else if (file_ext === '.mp4') {
        content_type = 'video/mp4';
    } else if (file_ext === '.txt') {
        content_type = 'text/plain';
    } else {
        content_type = 'text/html';
    }
    // CHECKING PATH
     if (content_type === 'text/html' && req.url === '/') {
        file_path = path.join(__dirname, 'public', 'index.html');
    } else if (content_type === 'text/html' && req.url.slice(-1) === '/') {
        file_path = path.join(__dirname, 'public', req.url, 'index.html');
    } else if (content_type === 'text/html') {
        file_path = path.join(__dirname, 'public', req.url, 'index.html');
    } else {
        file_path = path.join(__dirname, req.url);
    }
    // LOAD INDEX PAGE IF NO EXTENSION OR PATH HAS BEEN SPECIFIED
    if (!file_ext && req.url.slice(-1) !== '/') file_path += '.html';
    // CHECKING IF THE FILE EXISTS
    if (fs.existsSync(file_path)) {
        // CHECKING FOR IMAGE FILES
        if (!content_type.includes('image')) {
            // SERVE STATIC FILES
            fs.readFile(file_path, 'utf-8', (err, data) => {
                if (err) logger(`${err.name}\t${err.message}`, 'error');
                res.writeHead(200, { 'Content-Type': content_type });
                res.end(data);
                return;
            });
        } else {
            fs.readFile(file_path, '', (err, data) => {
                if (err) logger(`${err.name}\t${err.message}`, 'error');
                res.writeHead(200, { 'Content-Type': content_type });
                res.end(data);
                return;
            });
        }
        // CHECKING FOR VIDEO FILES
        if (content_type.includes('video')) {
            fs.readFile(file_path, 'binary', (err, data) => {
                if (err) logger(`${err.name}\t${err.message}`, 'error');
                res.writeHead(206, {
                    'Content-Type': content_type,
                    'Accept-Ranges': 'bytes'
                });
                res.end(data);
                return;
            });
        }
        // IF REQUESTED PAGE DOES NOT EXIST
    } else {
        logger('Page Not Found...', 'error');
        fs.readFile(path.join(__dirname, 'public', '404.html'), 'utf-8', (err, data) => {
            if (err) logger(`${err.name}\t${err.message}`, 'error');
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(data);
            return;
        });
    }
}).listen(PORT, () => log(`Server is running on host ${HOST}:${PORT}`));

