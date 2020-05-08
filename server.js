// Busca referência do http
const http = require("http");
const app = require('./app');
const api_config = require('./utils').getApiConfig();
const port = api_config.port || 3000;
const server = http.createServer(app);
server.listen(port);
