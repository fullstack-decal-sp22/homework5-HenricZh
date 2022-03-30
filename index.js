const express = require('express')
const axios = require('axios')

const app = express()

var port = process.env.PORT || 8080;

const router = express.Router()

app.use(express.json()) //utility for request body. req.body....
app.use(express.urlencoded({ extended: true })) //utility for parameters

app.listen(port, () => {
  console.log(`http://localhost:${port}/api`)
})

  
app.use("/api", router) // API Root url at: http://localhost:8080/api


const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/hmwrkFive'

// set up. similar to app = express()
mongoose.connect(url, { useNewUrlParser: true })
const db = mongoose.connection

//need these two methods
db.once('open', _ => {
    console.log('Database connected:', url)
})

db.on('error', err => {
    console.error('connection error:', err)
})


//create first model. instance of a model is a document
//Step 1: create a schema. A scehma is a JSON object that defines the structure nad contents of data
const Schema = mongoose.Schema;

const item = new Schema({
    image_url: String,
    date: String,
})

//model stuff to store in database following model from Schema
const TODO = mongoose.model('TODO', item)


router.get("/", function (req, res) {
  res.json({ message: "Welcome to the APOD app." });
});

router
    .route('/favorite')
    .get((req, res) => {
      TODO.find( {} , { _id: 0, image_url: 1, date : 1} ).then((todos) => {
        res.json({ result: todos })
      })
    });  
  
router
    .route('/add')
    .post(function (req, res) {
      const todo = new TODO({
        image_url: req.body.image_url,
        date: req.body.date,
      })
      todo.save((error, document) => {
        if (error) {
            res.json({ status: "failure"})
        } else {
            res.json({
                status: 'success',
                id: todo._id,
                content: req.body
            })
        }
      })
    });

router
    .route('/delete')
    .delete(function (req, res) {
      TODO.deleteOne({ date: req.body.date }).then(() => {
        res.json({
          message: "deleted"
        })
      })
    });