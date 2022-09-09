const fs = require("fs");
const readline = require("readline");
const stream = fs.createReadStream('./spammer_email_sample.csv')
const rl = readline.createInterface({ input: stream });

const verify_controller = require("./verfication")
let domains = new Map()
let emails  = []
let good_emails = []
let spam_emails = []
rl.on("line",(row)=> {
    const email = row.split(",")[1]
    emails.push(email)
    
})

rl.on("close",()=> {
    validateAllEmails().then(() => {console.log("validating..")}).catch((e)=> {console.log(e)})
})

async function validateAllEmails(){
    console.log("trying to validate emails")
    for (let i = 0; i < emails.length; i++){
        
        const email = emails[i]
        const domain = email.split('@')[1]
        if(!domains.has(domain)){
            const valid = await verify_controller.validateEmail(email)    
            domains.set(domain,valid)
        }

        fs.appendFile('email_valid_results.txt',`${email}:${domains.get(domain)}\n`,(err)=> {
            if(err){
                console.log(err)
            }
        })
        
    }

}

