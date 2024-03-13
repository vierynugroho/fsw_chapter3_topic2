const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const path = parsedUrl.pathname;

	switch (req.method) {
		case 'GET':
			if (path === '/') {
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('Hello, World!');
			} else {
				res.writeHead(404, { 'Content-Type': 'text/plain' });
				res.end('404 Not Found');
			}
			break;

		case 'POST':
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end('POST Request Received');
			break;

		case 'PUT':
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end('PUT Request Received');
			break;

		case 'DELETE':
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end('DELETE Request Received');
			break;

		default:
			res.writeHead(405, { 'Content-Type': 'text/plain' });
			res.end('Method Not Allowed');
	}
});

server.listen(3000, () => {
	console.log('Server is listening on port 3000');
});
