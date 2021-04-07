const { User } =require('../models/User')

let auth = (req, res, next) => {
    //Auth
    //Getting token from client
    let token = req.cookies.x_auth;
    //Find users with Token decrypted
    User.findMyToken(token, (err,user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth:false, err:true})
        req.token = token
        req.user = user
        next()
    })
}

module.exports = {auth}