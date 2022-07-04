const express = require("express");
const app = express();
const Login = require("../model/loginModel")
const jwt = require("jsonwebtoken")

// Login.insertMany({"UserName": "ekta", "Password": "ekta@123"})
const LoginData = async(req, res) => {
    try{
        const userData = req.body;
         await Login.findOne({UserName: userData.UserName}, (error, user) => {
            if(error){
                console.log(error);
            }
            else{
                if(!user){
                    res.status(401).send("Invalid user")
                }
                else{
                    if(user.Password !== userData.Password){
                        res.status(401).send("Invalid password")
                    }
                    else{
                        let payload = {subject: user._id}
                        let token = jwt.sign(payload, 'secretKey')
                        res.status(200).send({token})
                    }
                }
            }
        })
    }
    catch(error){

    }
}

module.exports = {
    LoginData
}