const express = require("express");

const app = express();
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

const { Users } = require("./utils/users");

const users = new Users();
const path = require("path");
const publicpath = path.join(__dirname, "public");

app.use(express.static(publicpath));

require("./startup/socket")(io, users);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`listining on ${port}`));
