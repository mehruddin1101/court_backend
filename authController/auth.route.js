const authRouter = require('express').Router()

// routes 

authRouter.post('/register', registerUser)

module.exports= authRouter
