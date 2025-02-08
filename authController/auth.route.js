//Project Imports
const authRouter = require('express').Router()
const authController = require('./auth.controller')


// routes 
authRouter.post('/register', authController.registerUser)
authRouter.post("/login", authController.loginUser)
authRouter.post("/forgort-password", authController.forgotPassword)
authRouter.post("/reset-password", authController.resetPassword)


module.exports= authRouter
