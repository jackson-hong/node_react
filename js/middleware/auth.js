const { User } =require('../models/User')

let auth = (req, res, next) => {
    //Auth

    //Getting token from client
    let token = req.cookies.x_auth;

    //Find users with Token decrypted
    User.findMyToken


}