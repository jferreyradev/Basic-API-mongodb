module.exports=(req,res, next) =>{
    if (!req.session.user) {
        res.json('loggin is required');
    }else{
        next();
    }
}