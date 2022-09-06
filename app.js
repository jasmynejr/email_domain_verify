const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')

const verify_controller = require('./verfication')

const app = express()
const port = 4000



app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',(req,res)=> {
    console.log("home route")
})


app.post('/verify',(req,res)=> {
    verify_controller.check_email_easy(req.body.email)
    res.send(req.body.domain)
})
app.listen(port, ()=> {
    console.log(`App listening on port ${port}`)
})