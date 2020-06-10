const server = require("./server.js");


const PORT = 8000;
server.listen(PORT, () => {
    console.log(`\n*** Server running on http://localhost:${PORT} ***\n`);
});

