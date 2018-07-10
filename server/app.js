const express = require('express')
const bodyParser = require('body-parser')
const diaryService  = require('./services/diaryService')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))

app.post('/api/addDiary', function (req, res) {
  let diaryServiceObj = new diaryService(req, res)
  diaryServiceObj.addDiary()
})

app.post('/api/getDiary', function (req, res) {
  let diaryServiceObj = new diaryService(req, res)
  diaryServiceObj.getDiary()
})

app.listen(3000, function () {
  console.log('Diary Web app service listening on port 3000!')
})