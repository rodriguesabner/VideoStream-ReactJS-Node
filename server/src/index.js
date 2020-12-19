"use strict";
const cors = require("cors");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io");
const { ExpressPeerServer } = require("peer");
const path = require("path");

const PORT = process.env.PORT || 21500;
const HOST = "0.0.0.0";

app.use(cors());

app.use((req, res, next) => {
  req.io = io;
  next();
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/kingaspx",
});

app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ApiFound", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "NotFound", "index.html"));
});

server.listen(PORT, HOST);
console.log(`Server is running on port ${PORT}`);
