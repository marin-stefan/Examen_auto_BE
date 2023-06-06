import express from "express";
import QuestionController from "../controllers/questionController.js";
import isAuth from "../middlewares/auth.js";



const app = express();

app.post('/', async (req, res) => {
    await QuestionController.create(req, res);
})

app.get('/', isAuth, async (req, res) => {
    await QuestionController.search(req, res);
})

export default app