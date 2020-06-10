const express = require("express");
const dbRouter = require("./data/router/db-router.js");
const server = express();

server.use(express.json());
server.use("/api", dbRouter);

//endpoints
server.get("/", (req,res) => {
    res.send(
        `<h1>This is Ali's Project</h1>
        <p>Testing 123</p>`
    );
});

module.exports = server;