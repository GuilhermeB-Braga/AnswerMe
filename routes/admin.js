const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const isAdmin = require("../helpers/isAdmin")
require("../models/Quiz")
const Quiz = mongoose.model("quizzes")
require("../models/Question")
const Question = mongoose.model("questions")
require("../models/User")
const User = mongoose.model("users")
require("../models/Answer")
const Answer = mongoose.model("answers")
const dayjs = require("dayjs")



router.get("/",isAdmin, (req, res)=>{

    res.render("admin/index")
    
})

router.get("/quizzes",isAdmin,(req, res) => {

    Quiz.find().then(quiz => {
        res.render("admin/quizzes", ({quiz: quiz}))
    })
})

router.get("/quizzes/:id/questions", isAdmin, (req, res) => {

    Quiz.findOne({_id: req.params.id}).then(quiz =>{

        Question.find({quiz: quiz._id}).then(question => {

            res.render("admin/quiz", ({question: question, quiz: quiz}))
            
        })
        
    })
    
})

router.get("/users",isAdmin, (req, res) => {

    User.find().populate("hierarchy").sort({hierarchy: "desc"}).then(user => {

        res.render("admin/users", ({user: user}))

        
    }).catch(err => {
        console.log("Falha ao carregar os usuários :/")
    })
    
})

//Create

router.get("/create/quiz",isAdmin, (req, res) => {
    res.render("admin/createQuiz")
})

router.post("/create/quiz",isAdmin, (req, res) => {

    const now = dayjs()
    const dateFormatted = now.format("D MMM YYYY") + " às " + now.format("H:MM")
    
    const newQuiz = {
        name: req.body.quizName,
        theme: req.body.quizTheme,
        description: req.body.quizDescription,
        date: dateFormatted,
        author: req.user.id
    }

    new Quiz(newQuiz).save().then(successMsg => {
        req.flash("success_msg", "Quiz salvo com successo!")
        res.redirect("/admin/quizzes")
    }).catch(err => console.log("Falha ao salvar o quiz. ERRO => " + err))
    
})

router.get("/create/:id/question",isAdmin, (req, res) => {

    Quiz.findOne({_id: req.params.id}).then(quiz=>{

        res.render("admin/createQuestion", {id: req.params.id, quiz: quiz})
        
    })
    
})

router.post("/create/question",isAdmin, (req, res) => {

    const newQuestion = {
        question: req.body.question,
        questionImage: req.body.questionImage,
        quiz: req.body.quiz,
        answer: req.body.answer,
        alternative_a: req.body.a,
        alternative_b: req.body.b,
        alternative_c: req.body.c,
        alternative_d: req.body.d
    }

    new Question(newQuestion).save().then(()=>{
        req.flash("success_msg", "Questão salva com o sucesso!")
        res.redirect(`/admin/quizzes/${req.body.quiz}/questions`)
    }).catch(err => {
        req.flash("error_msg", "Falha ao salvar a questão!")
        res.redirect(`/admin/quizzes/${req.body.quiz}/questions`)
    })
    
})

// Edit

router.get("/edit/quizzes",isAdmin, (req, res) => {

    Quiz.find().then(quiz => {
        
        res.render("admin/quizzes",isAdmin, ({quiz: quiz}))

    }).catch(err => console.log("Houve uma falha ao importar os quizzes :/"))
    
})

router.get("/edit/:id/quiz",isAdmin, (req, res) => {

    Quiz.findOne({_id: req.params.id}).then(quiz => {

        res.render("admin/editQuiz", ({quiz: quiz}))

    }).catch(err => console.log("Houve uma falha ao carregar o quiz :/"))
    
})

router.post("/edit/quiz",isAdmin, (req, res) => {

    Quiz.findOne({_id: req.body.id}).then( quiz => {

        quiz.name = req.body.name,
        quiz.theme = req.body.theme,
        quiz.description = req.body.description

        quiz.save().then(() => {
            req.flash("success_msg", "Quiz editado com sucesso :)")
            res.redirect(`/admin/quizzes/`)
        }).catch(err => {
            console.log("Houve uma falha ao editar o quiz :/")
            res.redirect("/admin/quizzes")
        })
        
    })
    
})

router.get("/edit/:quizId/question/:id",isAdmin, (req, res) => {

   Quiz.findOne({_id: req.params.quizId}).then(quiz => {

        Question.findOne({_id: req.params.id}).then(question => {

            res.render("admin/editQuestion", ({question: question, quiz: quiz}))
            
        })
    
   })
    
})

router.post("/edit/question",isAdmin, (req, res) => {
    
    Question.findOne({_id: req.body.id}).then(question => {

        question.question = req.body.question,
        question.questionImage = req.body.questionImage,
        question.answer = req.body.answer,
        question.alternative_a = req.body.a,
        question.alternative_b = req.body.b,
        question.alternative_c = req.body.c,
        question.alternative_d = req.body.d,

        question.save().then(()=>{
            console.log("Questão editada com succeso :)")
            res.redirect(`/admin/quizzes/${req.body.quiz}/questions`)
        }).catch(err => {
            console.log("Erro ao editar a questão :/")
            res.redirect(`/admin/quizzes/${req.body.quiz}/questions`)
        })
    })

})

// Delete

router.post("/delete/question/",isAdmin, (req, res) => {

    Question.deleteOne({_id: req.body.id}).then(()=>{

        console.log("Questão apagada com sucesso:)")
        res.redirect(`/admin/quizzes/${req.body.quizId}/questions`)
        
    })
    
})

router.post("/delete/quiz",isAdmin, (req, res) => {

    Quiz.deleteOne({_id: req.body.id}).then(() => {

        Question.deleteMany({quiz: req.body.id}).then(()=>{

            Answer.deleteOne({quizId: req.body.id}).then(answer => {

                req.flash("success_msg", "O quiz, questões e suas respostas foram apagados com sucesso :)")
                res.redirect("/admin/quizzes")
            
            })

        }).catch(err => {
            console.log("Houve uma falha ao apagar o quiz e suas questões :/")
            res.redirect("/admin/quizzes")
        })

    }).catch(err => {
        console.log("ERRO Interno > " + err)

    })
    
})

// Users

router.post("/delete/user",isAdmin, (req, res) => {

    User.deleteOne({_id: req.body.id}).then(()=>{
        console.log("Conta apagada com sucesso!")
        res.redirect("/admin/users")

    }).catch(err => {
        console.log("Houve uma falha ao tentar apagar a conta ERROR =>" + err)
        res.redirect("/admin/users")
    })
    
})

router.post("/toggle/admin", isAdmin, (req, res) => {

    User.findOne({_id: req.body.id}).then( user => {

        if(user.hierarchy === 1){
            user.hierarchy = 0

        }else{
            user.hierarchy = 1
        }

        user.save().then(success => {
            req.flash("success_msg", "Privilégios do usuário alterado com sucesso.")
            res.redirect("/admin/users")
        }).catch(err => {
            req.flash("error_msg", "Falha ao executar as alterações.")
            res.redirect("/admin/users")
            console.log(err)
        })
        
    }).catch(err => {
        req.flash("error_msg", "Falha ao executar as alterações.")
        res.redirect("/admin/users")
        console.log(err)
    })
    
})



module.exports = router