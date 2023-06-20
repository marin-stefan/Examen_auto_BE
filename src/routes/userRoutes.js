import express from "express";
import UserController from "../controllers/userController.js";
import userValidator from "../validators/userValidator.js";
import validate from "../validators/validator.js";
import isAuth from "../middlewares/auth.js";


const app = express();

app.post('/login', userValidator.loginRequest(), validate ,async (req, res) => {
    await UserController.login(req, res);
});

app.post('/', async (req, res) => {
    await UserController.create(req, res);
});

app.get('/:id', isAuth, async (req, res) => {
    await UserController.getUserById(req, res);
});

app.get('/stats/:id', isAuth, async (req, res) => {
    await UserController.getUserStatsById(req,res)
});

app.put('/:id', isAuth, async (req, res) => {
    await UserController.updateUser(req, res);
});

export default app;