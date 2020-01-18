require('dotenv').config();

const express = require("express");
var app =  express();

app.use(express.static("public"));




app.listen(process.env.SERVER_PORT || 8080, process.env.SERVER_HOSTNAME, ()=>{
    console.log("server listening on port "+ process.env.SERVER_PORT || 8080);
})