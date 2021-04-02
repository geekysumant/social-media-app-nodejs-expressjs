const nodemailer=require("../config/nodemailer");


exports.resetPassword= (resetPasswordUser)=>{
    console.log('inside reset pwd mailer');
    
    let htmlString=nodemailer.renderTemplate({resetPasswordUser:resetPasswordUser },"/reset_password.ejs");
    nodemailer.transporter.sendMail({
        from:"thehex.noreply@gmail.com",
        to : resetPasswordUser.user.email,
        subject: "Please reset your password",
        html: htmlString
    }, (err,info)=>{
        //info containe the information of the request that has been sent
        // if(err){console.log('error in sending mail',err);return }
        console.log('mail sent',info);
        return;
    })
}