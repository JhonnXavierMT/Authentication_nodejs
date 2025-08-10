module.exports = {
    SoloAdmin: function (req, res, next) {
        if (req.session.rol !== 'admin') {
            req.flash('info','Solo los administradores pueden acceder')
            return  res.redirect('/dashboard');
        }
        next()
    }
}