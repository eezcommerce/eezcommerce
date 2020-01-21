require('dotenv').config();

const express = require("express");
var app = express();


// dependencies


// custom modules
const mailService = require(__dirname + "/modules/emailService.js")


// express middlewares & setup
app.use(express.static("public"));


// routes
app.get("/send_verification_email_test/:email", (req, res) => {
    let email = req.params.email;

    mailService.sendVerificationEmail(email, "id")
        .then((e) => {
            res.send("Email sent to " + e);
        })
        .catch((e) => {
            res.send("Couldn't send email. Check the URL and try again.")

            if(e.toString().indexOf("Greeting") >= 0){
                console.log(e + "\n\n\n ***CHECK YOUR FIREWALL FOR PORT 587***");
            }

            
        })
})


app.get("/verify_email/:email/:token", (req, res)=>{
    let token = req.params.token;
    let email = req.params.email;

    mailService.verifyEmailToken(token, email)
        .then((email)=>{
            res.send(`The email ${email} has been verified.`)
        })
        .catch((error)=>{
            res.json(error)
        })


})



// start listening 
app.listen(process.env.SERVER_PORT || 8080, process.env.SERVER_HOSTNAME, () => {
    console.log("server listening on port " + process.env.SERVER_PORT || 8080);
})