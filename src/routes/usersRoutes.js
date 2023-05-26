import express from "express";
import UsersController from "../controllers/usersController.js";
import isAuth from "../middlewares/auth.js";
import validate from "../validators/validator.js";
import UsersValidator from "../validators/usersValidator.js";


const app = express();

app.get('/', isAuth, UsersValidator.searchRequest(), validate, async (req, res) => {
    await UsersController.search(req, res)
})


export default app