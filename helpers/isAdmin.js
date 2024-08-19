module.exports = isAdmin = (req, res, next) => {

        if(req.isAuthenticated() && req.user.hierarchy == 1){
            return next()
        }

        req.flash("error_msg", "Você não tem permissões suficientes para acessar está rota!")
        res.redirect("/")
        
    }
