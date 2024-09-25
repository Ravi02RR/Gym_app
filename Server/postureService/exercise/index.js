const express = require('express');
const app = express();
const data = require('./exercise.json')
const cors=require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/getExercise', (req, res) => {
    res.json(data)
})

app.listen(3000, () => (
    console.log("server is running on port 3000")
))