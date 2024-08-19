module.exports = isLogged = (req, res, next) =>{

    if(req.isAuthenticated()){
        return next()
    }
    
    req.flash("error_msg", "Para acessar você deve estar logado!")
    res.redirect("/login")
}