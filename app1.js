const nodemailer=require('nodemailer')
const {google}= require('googleapis')
const express=require("express");
const cors=require("cors");
const bodyParser=require("body-parser");

const CLIENT_ID='723470025392-2d2pl6pu9q9l75kbsgc042sh668jk8v1.apps.googleusercontent.com';
const CLIENT_SECRET='3y5eP1IgscDj-djG1c5H5mbR';
const REDIRECT_URI='https://developers.google.com/oauthplayground';
const REFRESH_TOKEN='1//04mjbxjJrKbikCgYIARAAGAQSNwF-L9Irwvk9FYzHtf8dhV7hmTRfNynlEKknISzxunMhbvwUosVz8Geeyop5KZ784nj2xyp-Uys';

//For Testing cahnge :To: mail address and check. 

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
const app=express();
app.use(cors({origin:"*"}));
app.use(bodyParser.json());
app.listen(3000, ()=>{
    console.log("running");
});

app.get("/",(req,res)=>{
    res.send("<h1>Hello Welcome KJAWSEVENT</h1>");
});

app.post("/sendmail", (req,res)=>{
    let user=req.body;
    sendMail(user,info=>{
        res.send(info);
    });
});

async function sendMail(user,callback){
    try{
        const accessToken =await oAuth2Client.getAccessToken()

        const transport =nodemailer.createTransport({
            service:'gmail',
            auth:{
                type:'OAUTH2',
                user:'forapiuse02@gmail.com',
                clientId:CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const mailOptions={
            from:'AWSEvent organized by Kalajitha<forapiuse02@gmail.com>',
            to:user.Email,
            subject:"Registered successfully!",
            html:`<p>Hello ${user.Firstname+" "+user.Middlename+" "+user.Lastname},<br>
            You have successfully registered for the AWS Event Organized by Kalajitha.<br>
            Your Transaction Password is:<b>${user.Tpwd}</b></p>`
        };
        const result= await transport.sendMail(mailOptions)
        callback(result);
    }
    catch(error){
        return error;
    }
}
sendMail()
.then((result)=>console.log('Email sent',result))
.catch((error)=> console.log(error.message))