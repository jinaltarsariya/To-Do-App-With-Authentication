const express = require('express')
const route = express.Router()

const { userSignup, userLogin } = require('../controllers/user.controller')


route.post("/user/signup", userSignup)
route.post('/user/login', userLogin)

module.exports = route