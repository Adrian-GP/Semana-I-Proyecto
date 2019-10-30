const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send("Hola"))

app.get('/trainer', (req, res) => res.sendFile(__dirname + '/trainer/index.html'))

app.get('/recognizer', (req, res) => res.sendFile(__dirname + '/recognizer/index.html'))

app.use(express.static(__dirname));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))