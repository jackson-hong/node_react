const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User }= require('./models/User')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { auth } = require('./middleware/auth')

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cookieParser())


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log("MongoDB connected..."))
    .catch(err => console.log(err))

app.get('/', ((req, res) => res.send('Hello!!')))

app.get('/api/hello',(req, res) => {
    res.send("HI~~~~")
})


app.post('/api/users/register',(req,res) => {

    const user = new User(req.body)

    user.save((err,doc) => {
        if(err) return res.json({ success : false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    User.findOne({ email:req.body.email },(err, user) => {
        console.log(user)
        if(!user){
            return res.json({
                loginSuccess:false,
                message:"No users"
            })
        }

        user.comparePassword(req.body.password , (err, isMatch) => {
            console.log(isMatch)
            if(!isMatch)
                return res.json({loginSuccess:false, message:"Wrong password"})
            user.generateToken((err, user) => {
                if(err)return res.status(400).send(err)
                // Saving token -> Cookie or Local storage
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess:true, userId:user._id})

            })
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Auth가 True라는 말
    res.status(200).json({
        _id:req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email:req.user.email,
        name:req.user.lastname,
        role:req.user.role,
        image:req.user.image
    })
})

app.get('/api/users/logout', auth, (req,res) => {
    User.findOneAndUpdate({_id:req.user._id},{token : ""},(err,user) =>{
            if(err) return res.json({success:false, err})
            return res.status(200).send({
                success:true
            })
        })
})

app.listen(port, () => console.log(`port = ${port}`))