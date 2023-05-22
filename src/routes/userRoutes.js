import { express } from "express";
import UserController from "../controllers/userController";


const app = express();

app.post('/login', async (req, res) => {
    await UserController.login(req, res);
})

export default app;