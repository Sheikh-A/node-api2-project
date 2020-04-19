//Creating the server
const express = require("express");

const dbRouter = require("./data/router/db-router.js")
const server = express();

server.use(express.json());
server.use("/api", dbRouter);

//endpoints
server.get("/", (req,res) => {
    res.send(
        `<h1>Tesing Ali's Router</h1>`
    );
});

module.exports = server;