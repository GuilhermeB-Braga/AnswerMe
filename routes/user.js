const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/User")
const User = mongoose.model("users")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const isLogged = require("../helpers/isLogged")
const Quiz = mongoose.model("quizzes")
require("../models/Question")
const Question = mongoose.model("questions")
require("../models/Answer")
const Answer = mongoose.model("answers")



router.get("/register", (req, res) => {

    res.render("user/register")

})


router.post("/register", (req, res) => {

    User.findOne({email: req.body.email}).then(user => {

        if(user){

            req.flash("error_msg", "Email já cadastrado!")
            res.redirect("/register")
            
        }else{

            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            })

            bcrypt.genSalt(10, (err, salt) => {

                bcrypt.hash(newUser.password, salt, (err, hash) => {

                    newUser.password = hash

                    newUser.save().then(() => {

                        req.flash("success_msg", "Usuário registrado com sucesso!")
                        res.redirect("/")
                        
                    }).catch(err => {
                        console.log("Falha ao registrar o usuário :/")
                    })
                    
                })
            })
        }
    })
})





router.get("/login", (req, res) => {

    res.render("user/login")
    
})

router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)

    
})



router.get("/logout",isLogged, (req, res) => {

    req.logout(function(err) {
        if (err) { return next(err) }
        req.flash("success_msg", "Logout efetuado com sucesso :)")
        res.redirect('/')
      })
    
})

router.get("/profile",isLogged, (req, res) => {
    
    User.findOne({_id: req.user._id}).then(user => {
        
        
        Answer.find({userId: user._id}).then(answers => {

            const idArr = answers.map(answer => answer.quizId)
            
            Quiz.find({ _id: {$in: idArr}}).populate("date").sort({date: "desc"}).then(quiz => {

                res.render("user/profile", {user: user, answers: answers, quiz: quiz})
                
            })
            
        })


        
    }).catch(err => {
        req.flash("error_msg", "Usuário não encontrado!")
    })
})

router.post("/profile/edit", (req, res) => {

    User.findOne({_id: req.body.id}).then(user => {

        user.firstName = req.body.firstName
        user.lastName = req.body.lastName
        user.email = req.body.email
        user.save().then(save => {
            req.flash("success_msg", "Perfil editado com sucesso.")
            res.redirect("/profile")
        })

    })

})






module.exports = router