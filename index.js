// require your server and launch it here
const server = require('./api/server')

const port = 3001;



server.listen(port, () => {
    console.log(`Server running on port :${port}`)
})