const Token=require('../models/token');
const User=require('../models/user');
module.exports.verifyEmail =async (req,res)=>{
    try {
        let accessTokenInRequest=req.params.id;
        let accessToken=await Token.findOne({token:accessTokenInRequest});

        if(accessToken){
            let userId=accessToken.userId;
            let user= await User.findById(userId);
            user.isVerified=true;
            user.save();

            accessToken.remove();
            req.flash('success','Email Verified!');
            return res.redirect('/users/signin');
        }else{
            req.flash('error','Uh-oh, invalid token');
            return res.redirect('/users/signin');
        }
    } catch (error) {
        
    }
}