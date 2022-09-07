const validator = require("deep-email-validator")
const { exec,spawn } = require('node:child_process')
const { resolve } = require("node:path")



let checkedDomains = new Map()
checkedDomains.set("gmail.com",true)




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


async function getMxServer(domain){
    let mxOutput = await lookupMxServers(domain)
    let outputs = mxOutput.split("\n").splice(3)
    let highestPrefServer = ""
    let highestPref = 100
    if (outputs[0] === ''){
        console.log('no mx servers for domain')
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
    
    


    return new Promise((resolve,reject) => {
        try {
            const pingRequest =  spawn("ping",[server])
            let pinged = true
            var start = new Date().getTime();
            pingRequest.stdout.on("data",data => {
            let out = data.toString()
            console.log(out)
            if(out.substring(0,3) === "Req"){
                pinged = false;
                console.log(`line 76 ${pinged}`)
                pingRequest.kill()
                resolve(pinged)
            }
            
        })
        
        }
        catch(e) {
            reject(e)
        }
     })
  
 }

async function validateEmail(email){
    
    let domain = email.split('@')[1]

    if(checkedDomains.has(domain)){
        return checkedDomains.get(domain)
    }

    let server = await getMxServer(domain)

    if(server==="none"){
        return false
    }
    
    return true
    
}

validateEmail("tyson@firstpremierhomewarranty.com")
.then((output) => console.log(` final output: ${output}`))
.catch((err) => console.log(err))