const validator = require("deep-email-validator")
const { exec,spawn,spawnSync } = require('node:child_process')

let checkedDomains = new Map()


// easy, straight forward way for checking email -- can be slow
async function check_email_easy(email){
    let res = await validator.validate({
        email: email,
        validateMx:true,
        validateSMTP:true
    })
    console.log(res)
    return res;
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


async function getMxServer(domain){
    let mxOutput = await lookupMxServers(domain)
    let outputs = mxOutput.split("\n").splice(3)
    let highestPrefServer = ""
    let highestPref = 100
    if (outputs[0] === ''){
        return "none"
    }

    if(outputs[0].split(' ').length === 1){
        return "none"
    }
    for(let i = 0; i< outputs.length; i++){
        let tabSplit = outputs[i].split('\t').slice(1)
        for(let j = 0;j<tabSplit.length;j++){
          let prefsAndMxs = tabSplit[j].split("=")
          let curPref = prefsAndMxs[1].split(',')[0].trim()
          if(parseInt(curPref) < highestPref) {
            highestPref = curPref
            highestPrefServer = prefsAndMxs[2].trim()
          }
        }
    }

    return highestPrefServer
    
}

function pingServer(server) {
    const pingServerSync = spawnSync('ping',[server], {
        timeout:1000
    })
    
    const output = pingServerSync.stdout.toString().split("\n")
    if(output.length > 3){
        return true;
    }
    else{
        return false;
    }
 }

async function validateEmail(email){
    
    let domain = email.split('@')[1]

    
    let server = await getMxServer(domain)

    if(server==="none"){
       
        return false
    }
    if(pingServer(server)){     

        return true
    }
    else{


        return false
    }
   
    
    
}
module.exports = {check_email_easy,validateEmail}