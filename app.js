const express = require("express")
const bodyParser = require("body-parser")
const handlebars = require("express-handlebars")
const path = require("path")
const app = express()
const mongoose = require("mongoose")
const session = require("express-session")
require("./models/Quiz")
const Quiz = mongoose.model("quizzes")
const User = require("./routes/user")
const Admin = require("./routes/admin")
const Game = require("./routes/game")
const passport = require("passport")
require("./config/auth")(passport)
const flash = require("connect-flash")
const dayjs = require("dayjs")

// Configs

    // Session

    app.use(session({
        secret: "anything",
        resave: true,
        saveUninitialized: true
    }))

    app.use(flash())

    app.use(passport.initialize())
    app.use(passport.session())

    //Handlebars
    
        app.engine('handlebars', handlebars.engine ({
            defaultLayout: 'main', runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true
            }
        }))

        app.set('view engine', 'handlebars');
    
    //Middlewares

        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user
            next()
        })

    // Body Parser

        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())

    // Public

        app.use(express.static(path.join(__dirname, "public")))
    
    //Mongoose

    mongoose.Promise = global.Promise
        
    mongoose.connect("mongodb://localhost:27017/answerme").then(()=>{
        console.log("#Conectado ao Banco de Dados :)")
    }).catch( err => {
        console.log("#Falha ao se conectar ao banco de dados :/ ERROR => " + err)
    })


// Routes
     
    app.get("/", (req, res) => {
        Quiz.find().populate("date").sort({date: "desc"}).then(quiz => {

            res.render("homepage/home", {quiz: quiz})
            
        })
    })

    app.use("/", User)

    app.use("/admin", Admin)

    app.use("/game", Game)




    app.listen(3333, ()=>{
        console.log("Servidor rodando na porta 3333")
    })
