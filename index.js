const http = require('http');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const url = require('url');

//! dotenv config
dotenv.config();

//! declaration variable
const PORT = process.env.PORT;
const PUBLIC_DIRECTORY = path.join(__dirname, 'public');

const carsRoute = (fileName) => {
	const filePath = path.join(PUBLIC_DIRECTORY, fileName);
	return fs.readFileSync(filePath, 'utf-8');
};

const toJSON = (value) => {
	return JSON.stringify(value);
};

//! HTML Request
// const onRequest = (req, res) => {
// 	switch (req.url) {
// 		case '/':
// 			res.writeHead(200);
// 			res.end(carsRoute('index.html'));
// 			break;
// 		case '/cars':
// 			res.writeHead(200);
// 			res.end(carsRoute('cars.html'));
// 			break;
// 		default:
// 			res.writeHead(404);
// 			res.end(carsRoute('404.html'));
// 			break;
// 	}
// };

//! JSON Req
// const onRequest = (req, res) => {
// 	const responseJSON = toJSON({
// 		id: 'myID-eaaa-15oct-ily',
// 		username: 'viery nugroho',
// 		email: 'viery15102002@gmail.com',
// 		encrypted_password: 'lkasdn23kjasdAS02*&s12%',
// 	});

// 	res.setHeader('Content-Type', 'application/json');
// 	res.writeHead(200);
// 	res.end(responseJSON);
// };

//! CRUD Method
const onRequest = (req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const path = parsedUrl.pathname;

	//! Services
	const readFile = (filePath) => {
		return fs.readFileSync(filePath, 'utf-8');
	};

	const getAllUsers = () => {
		const filePath = './data/users.json';
		const data = readFile(filePath);
		const jsonData = JSON.parse(data);
		return jsonData;
	};

	const getUserById = (userId) => {
		const allUsers = getAllUsers();
		const user = allUsers.find((user) => user.id == userId.id);
		if (user == null) {
			return res.end('User Not Found!');
		}

		return user;
	};

	//! Controller
	const createUser = (data) => {
		const filePath = './data/users.json';
		const allUsers = getAllUsers();
		const idUsers = allUsers.map((user) => user.id);

		if (idUsers.includes(data.id)) {
			return res.end('ID already exists. Please update data instead.');
		}

		const updatedData = [...allUsers, data];
		const updatedJsonData = JSON.stringify(updatedData);
		fs.writeFileSync(filePath, updatedJsonData);
	};

	const updateUser = (data) => {
		const filePath = './data/users.json';
		const allUsers = getAllUsers();

		const user = getUserById(data);

		user.name = data.name;
		user.address = data.address;
		user.age = data.age;

		const updatedUser = allUsers.map((u) => (u.id === user.id ? user : u));
		fs.writeFileSync(filePath, JSON.stringify(updatedUser));
	};

	const deleteUser = (data) => {
		const filePath = './data/users.json';
		const allUsers = getAllUsers();
		const user = getUserById(data);
		const userUndeleted = allUsers.filter((u) => u.id !== user.id);
		fs.writeFileSync(filePath, JSON.stringify(userUndeleted));
	};

	switch (req.method) {
		case 'GET':
			if (path === '/') {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(getAllUsers()));
			} else {
				res.writeHead(404, { 'Content-Type': 'application/json' });
				res.end('404 Not Found');
			}
			break;

		case 'POST':
			createUser({
				id: '151002',
				name: 'Viery',
				age: 21,
				address: 'Blitar',
			});
			res.writeHead(201, { 'Content-Type': 'text/plain' });
			res.end(`User Created Successfully with data`);
			break;

		case 'PUT':
			updateUser({
				id: '151002',
				name: 'Viery',
				age: 21,
				address: 'Blitar',
			});
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end('User Updated Successfully');
			break;

		case 'DELETE':
			deleteUser({
				id: '200802',
			});

			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end('DELETE User');
			break;

		default:
			res.writeHead(405, { 'Content-Type': 'text/plain' });
			res.end('Method Not Allowed');
	}
};

const server = http.createServer(onRequest);

server.listen(PORT, () => {
	console.log(`Server running in http://localhost:${PORT}`);
});
