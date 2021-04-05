const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User }= require('./models/User')

const config = require('./config/key')

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log("MongoDB connected..."))
    .catch(err => console.log(err))




app.get('/', ((req, res) => res.send('Hello!!')))

app.post('/register',(req,res) => {

    const user = new User(req.body)

    user.save((err,doc) => {
        if(err) return res.json({ success : false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.post('/login', (req, res) => {
    User.findOne({ email:req.body.email },(err, userInfo) => {
        if(!userInfo){
            return res.json({
                loginSuccess:false,
                message:"No users"
            })
        }

        user.comparePassword(req.body.password , (err, isMatch ) => {

        })
    })
})

app.listen(port, () => console.log(`port = ${port}`))

//mongodb+srv://jackson:<password>@cluster0.bcvxi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority