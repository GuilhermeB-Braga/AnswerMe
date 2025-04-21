const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Quiz")
const Quiz = mongoose.model("quizzes")
require("../models/Question")
const Question = mongoose.model("questions")
require("../models/Answer")
const Answer = mongoose.model("answers")
const isLogged = require("../helpers/isLogged")
const dayjs = require("dayjs")

// Views for users

router.get("/", isLogged, (req, res) => {

    Quiz.find({author: req.user._id}).then(quiz => {
        res.render("game/game-center", {quiz: quiz})
    })
    
})

router.get("/quizzes/:id/questions", (req, res) => {

    Quiz.findOne({_id: req.params.id}).then(quiz =>{

        Question.find({quiz: quiz._id}).then(question => {

            res.render("game/my-quiz", ({question: question, quiz: quiz}))
            
        })
        
    })
    
})


// For Users


// Quiz

// Create

router.get("/create/quiz", isLogged, (req, res) => {
    res.render("game/create-quiz")
})

router.post("/create/quiz", isLogged, (req, res) => {

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
        res.redirect("/game")
    }).catch(err => console.log("Falha ao salvar o quiz. ERRO => " + err))
    
})

// Edit

router.get("/edit/:id/quiz", isLogged, (req, res) => {

    Quiz.findOne({_id: req.params.id}).then(quiz => {

        res.render("game/edit-quiz", ({quiz: quiz}))

    }).catch(err => console.log("Houve uma falha ao carregar o quiz :/"))
    
})

router.post("/edit/quiz", isLogged, (req, res) => {

    Quiz.findOne({_id: req.body.id}).then( quiz => {

        quiz.name = req.body.name,
        quiz.theme = req.body.theme,
        quiz.description = req.body.description

        quiz.save().then(() => {
            req.flash("success_msg", "Quiz editado com sucesso :)")
            res.redirect(`/game`)
        }).catch(err => {
            console.log("Houve uma falha ao editar o quiz :/")
            res.redirect("/game")
        })
        
    })
    
})

// Delete

router.post("/delete/quiz",isLogged, (req, res) => {

    Quiz.deleteOne({_id: req.body.id}).then(() => {

        Question.deleteMany({quiz: req.body.id}).then(()=>{

            Answer.deleteOne({quizId: req.body.id}).then(answer => {

                req.flash("success_msg", "O quiz, questões e suas respostas foram apagados com sucesso :)")
                res.redirect("/game")
            
            })

        }).catch(err => {
            console.log("Houve uma falha ao apagar o quiz e suas questões :/")
            res.redirect("/game")
        })

    }).catch(err => {
        console.log("ERRO Interno > " + err)

    })
    
})


// Question

// Create

router.get("/create/:id/question", isLogged, (req, res) => {

    Quiz.findOne({_id: req.params.id}).then(quiz=>{

        res.render("game/create-question", {id: req.params.id, quiz: quiz})
        
    })
    
})

router.post("/create/question", isLogged, (req, res) => {

    const newQuestion = {
        question: req.body.question,
        quiz: req.body.quiz,
        questionImage: req.body.questionImage,
        answer: req.body.answer,
        alternative_a: req.body.a,
        alternative_b: req.body.b,
        alternative_c: req.body.c,
        alternative_d: req.body.d
    }

    new Question(newQuestion).save().then(()=>{
        req.flash("success_msg", "Questão salva com o sucesso!")
        res.redirect(`/game/quizzes/${req.body.quiz}/questions`)
    }).catch(err => {
        req.flash("error_msg", "Falha ao salvar a questão!")
        res.redirect(`/game/quizzes/${req.body.quiz}/questions`)
    })
    
})

// Edit

router.get("/edit/:quizId/question/:id", isLogged, (req, res) => {

    Quiz.findOne({_id: req.params.quizId}).then(quiz => {
 
         Question.findOne({_id: req.params.id}).then(question => {
 
             res.render("game/edit-question", ({question: question, quiz: quiz}))
             
         })
     
    })
     
 })
 
 router.post("/edit/question", isLogged, (req, res) => {
     
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
             res.redirect(`/game/quizzes/${req.body.quiz}/questions`)
         }).catch(err => {
             console.log("Erro ao editar a questão :/")
             res.redirect(`/game/quizzes/${req.body.quiz}/questions`)
         })
     })
 
 })

//  Delete

router.post("/delete/question/",isLogged, (req, res) => {

    Question.deleteOne({_id: req.body.id}).then(()=>{

        console.log("Questão apagada com sucesso:)")
        res.redirect(`/game/quizzes/${req.body.quizId}/questions`)
        
    })
    
})

// 

router.get("/quizzes",isLogged, (req, res) => {

    Quiz.find().then(quiz => {
        res.render("game/index", {quiz: quiz})
    })
    
})

router.get("/:quizId",isLogged, (req, res) => {

    Quiz.findOne({_id: req.params.quizId}).then(quiz => {

        Question.find({quiz: quiz._id}).then( questions => {

            res.render("game/quiz", {quiz: quiz, question: questions})
            

        })
        
    })
    
})

router.post("/save/answers",isLogged, (req, res) => {

    const pointsArr = []
    const errorsArr = []

    Answer.findOne({userId: req.body.userId, quizId: req.body.quizId}).then(answer => {

        if(answer){
            Answer.deleteOne({_id: answer._id}).then(()=>{
                req.flash("success_msg", "Resposta anterior foi substituida.")
            })
        }

    }).catch(err => {console.log("Falha ao substituir resposta anterior. ERRO: " + err)})

    Question.find({quiz: req.body.quizId}).then(questions => {
        
        questions.forEach((question, index) => {

            if(question.answer == req.body.userAnswer[index]){
                pointsArr.push(1)
            }else{
                errorsArr.push(1)
            }

        })

        const newAnswer = {
            userId: req.body.userId,
            quizId: req.body.quizId,
            totalErr: errorsArr.length,
            points: pointsArr.length,
            userAnswer: [{
                questionId: req.body.questionId,
                answer: req.body.userAnswer
            }]
        }   
    
        new Answer(newAnswer).save().then(success => {
            req.flash( "success_msg", "Resposta salva com sucesso.")
            res.redirect(`/game/${req.body.quizId}/${req.body.userId}/answers`)
            
        }).catch(err => {
            req.flash("error_msg", "Houve uma falha ao salvar suas respostas.")
            console.log("Houve uma falha ao salvar suas respostas.")
    
        })

    })

})
    
    

router.get("/:quizId/:userId/answers",isLogged, (req, res) => {

    Quiz.findOne({_id: req.params.quizId}).then(quiz => {

        Question.find({quiz: req.params.quizId}).then( question => {

            Answer.findOne({quizId: req.params.quizId, userId: req.params.userId}).then(answer => {
                
                res.render("game/answer", {quiz: quiz, question: question, answer: answer})
                
            })
            
        })

        
    })
    
})



module.exports = router