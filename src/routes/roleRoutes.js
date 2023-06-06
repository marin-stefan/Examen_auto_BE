import express from "express";
import RoleController from "../controllers/roleController.js";
import isAuth from "../middlewares/auth.js";
import roleValidator from "../validators/roleValidator.js";
import validate from "../validators/validator.js";


const app = express();

app.post('/get-role-by-name', isAuth, roleValidator.getNameRequest(), validate, async (req, res) => {
    await RoleController.getRoleByName(req, res)
})

export default app