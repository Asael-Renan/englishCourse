export function admAuth(req, res, next) {
    // if (req.session.user && req.session.user.role === 'adm') {
        next()
    // } else {
    //     res.send('no aut adm <a href="/">inicio</a>')
    // }
}

export function teacherAuth(req, res, next) {
    // console.log(parseInt(req.url.split('/').pop()))
    // if (!req.session.user) {
    //     res.send('no aut teacher <a href="/">inicio</a>')
    //     return
    // }
    // if (req.session.user.role === 'teacher' && req.session.user.id === parseInt(req.url.split('/').pop()) || req.session.user.role === 'adm') {
        next()
    // } else {
    //     res.send('no aut teacher <a href="/">inicio</a>')
    // }
}

export function studentAuth(req, res, next) {
    // if (req.session.user && req.session.user.id === parseInt(req.url.split('/').pop())) {
        next()
    // } else {
        // res.send('no aut student <a href="/">inicio</a>')
    // }
}