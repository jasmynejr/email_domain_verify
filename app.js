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


app.post('/verify',async (req,res)=> {
    try {
        console.log(req)
        let isValid = await verify_controller.validateEmail(req.body.email)
        res.json({valid:isValid})
    }
    catch(e){
        res.send(e)
    }
})
app.listen(port, ()=> {
    console.log(`App listening on port ${port}`)
})