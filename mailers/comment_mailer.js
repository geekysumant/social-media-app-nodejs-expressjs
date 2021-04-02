const nodemailer=require("../config/nodemailer");


exports.newComment= (comment)=>{
    console.log('inside new comment mailer');
    console.log(comment.user.email,"*******************");
    let htmlString=nodemailer.renderTemplate({comment:comment},"/new_comment.ejs");
    nodemailer.transporter.sendMail({
        from:"thehex.noreply@gmail.com",
        to : comment.user.email,
        subject: "New Comment Published!",
        html: htmlString
    }, (err,info)=>{
        //info containe the information of the request that has been sent
        // if(err){console.log('error in sending mail',err);return }
        console.log('mail sent',info);
        return;
    })
}