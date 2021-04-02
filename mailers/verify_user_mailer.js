const nodemailer=require("../config/nodemailer");


exports.sendVerification= (user)=>{
    console.log('inside verify user mailer', user);
    
    let htmlString=nodemailer.renderTemplate({user:user },"/send_verification.ejs");
    nodemailer.transporter.sendMail({
        from:"thehex.noreply@gmail.com",
        to : user.userId.email,
        subject: "Please verify your email",
        html: htmlString
    }, (err,info)=>{
        if(err){console.log('error in sending mail',err);return }
        console.log('mail sent',info);
        return;
    })
}