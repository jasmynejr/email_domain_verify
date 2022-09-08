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

/**
 * 
 * @param {*} domain 
 * @returns the result of seraching the name servers for the given domain
 * @desc searches MX servers for the domain 
 */
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

/**
 * 
 * @param {*} domain 
 * @returns Either no server or the MX server with the highest preference 
 */
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

/**
 * Pings MX server to see if it is active or not
 * Times out after 1000 ms 
 * @param {*} server 
 * @returns boolean 
 */
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


 /**
  * Checks to see if email is valid or not
  * @param {*} email 
  * @returns booleans
  */
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