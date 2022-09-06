const fs = require("fs");
const readline = require("readline");
const stream = fs.createReadStream('./spammer_email_sample.csv')
const rl = readline.createInterface({ input: stream });

const verify_controller = require("./verfication")
let emails = []

rl.on("line",(row)=> {
    const full_line = row.split(",")
    emails.push(full_line[1])
})

rl.on("close",() =>{
    console.log(emails)
})

async function testEmail(email){
    let isValid = await verify_controller.check_email_easy(email)["valid"]
    console.log(`${email}: ${isValid}`)
}
testEmail("none@gmail.com")