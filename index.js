const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')
app.use(cors())

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50md', extended: true, parameterLimit: 50000 }))
mongoose.Promise = global.Promise;
mongoose.connect('....');
const port = process.env.port || 8000;
app.get('/', (req, res) => {
    res.status(200).send("Welcome")
})
app.listen(port, () => { console.log(`app is running on ${port}`); })