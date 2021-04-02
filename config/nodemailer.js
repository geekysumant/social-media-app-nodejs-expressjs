const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');
const env=require('./environment');


//the part which sends the mails
//for host and port google smtp gmail
let transporter=nodemailer.createTransport(env.smtp); 

let renderTemplate = (data,relativePath)=>{
    // console.log(data);
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        (err,template)=>{
            if(err){console.log("error in rendering template",err);return ;}

            mailHTML=template;
        }
    )
    return mailHTML;
}


module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}