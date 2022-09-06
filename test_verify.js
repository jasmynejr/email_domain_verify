const { exec, spawn } = require('node:child_process')

exec('nslookup -type=mx jasmyne.na.com',(err,output)=> {
    if(err){
        console.error("could not execute command",err)
        return
    }

    console.log(output)
})