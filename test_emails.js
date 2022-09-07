const fs = require("fs");
const readline = require("readline");
const stream = fs.createReadStream('./spammer_email_sample.csv')
const rl = readline.createInterface({ input: stream });

const verify_controller = require("./verfication")
let emails = []

rl.on("line",(row)=> {
    const full_line = row.split(",")
    emails.push(full_line[1])
    verify_controller.validateEmail(full_line[1]).then((res)=> {
        if(!res){
            console.log(`${full_line[1]}`)
        }
        
     })
     .catch(err => console.log(err))
})

