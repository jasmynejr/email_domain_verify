const express = require('express')
const path = require('path');
const app = express()
const port = 4000

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=> {
    console.log("home route")
})

app.listen(port, ()=> {
    console.log(`App listening on port ${port}`)
})