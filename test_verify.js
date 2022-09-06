const validator = require("deep-email-validator")
const { exec } = require('node:child_process')
const { resolve } = require("node:path")

async function check_email_easy(email){
    let res = await validator.validate({
        email: email,
        validateMx:true,
        validateSMTP:true
    })

    console.log(res)
}


function lookupMxServers(domain){
    
    return new Promise((resolve,reject)=> {
        exec(`nslookup -type=mx ${domain}`,(err,output) => {
            if(err){
                reject(err)
            }
            resolve(output)
        })
    })
}

async function parseMxOutput(){
    mxOutput = await lookupMxServers("gmail.com")
    console.log(mxOutput.split("\n").splice(3))
}

parseMxOutput()