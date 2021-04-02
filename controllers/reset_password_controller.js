const ResetPassword=require('../models/reset_password_user');
const resetPasswordMailer=require('../mailers/reset_password_mailer');
const User=require('../models/user');
const crypto=require('crypto');
const {ObjectId}=require('mongodb');

module.exports.resetPasswordPage=(req,res)=>{
    return res.render('reset_password');
}

//this is coming via a post request
module.exports.resetPasswordMail=async (req,res)=>{

    //search the email in db 
    let user= await User.findOne({email:req.body.email});

    if(user){
        let resetToken= crypto.randomBytes(20).toString("hex");
        let resetUser=await ResetPassword.create({
            user: user._id,
            accessToken: resetToken
        });

        await resetUser.populate({
            path: 'user',
            select: "_id name email avatar"
        }).execPopulate();
        resetPasswordMailer.resetPassword(resetUser);
        return res.render('reset_mail_sent');
    }else{
        req.flash('error',"Invalid email");
        return res.redirect('back');
    }
}
module.exports.resetPassword =async (req,res)=>{
    try {
        
        let resetUser=await ResetPassword.findOne({accessToken:req.params.id});
        if(resetUser && resetUser.isValid){
            let user= await User.findById(resetUser.user);
            if(user){
                resetUser.remove();
                return res.render('reset_password_form',{
                    user_id: user._id
                });
            }
        }else{
            req.flash('error','Uh-oh, invalid token');
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error',err);
        return res.status(500).json({
            message:"Internal Server Error"
        })
        
    }
}

module.exports.newPasswordForm=async (req,res)=>{
    try {
        let user=await User.findById(req.body.userId);
        
        if(user && user.isVerified){
            
            let pwd=req.body.password;
            let confirmPwd=req.body["confirm-password"];
            console.log(pwd,confirmPwd);
            
            if(pwd!==confirmPwd){
                
                req.flash('error',"Password and confirm password do not match.");
                return res.redirect('back');
            }else{
                user.password=pwd;
                user.save();
                
                req.flash('success','Password has been changed!');
                return res.redirect('/users/signin');
            }
        }else{
            req.flash('error','Invalid User');
            return res.redirect('/users/signin');
        }
    } catch (error) {
        
    }
}