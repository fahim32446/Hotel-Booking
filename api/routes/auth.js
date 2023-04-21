// import { login, register } from '../controller/auth';
const {login, register} = require('../controller/auth.js')

const express = require('express');

const router = express.Router();



router.post('/register', register);
router.post('/login', login);

export default router