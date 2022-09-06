const validator = require("deep-email-validator")



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


module.exports = {check_email_easy}