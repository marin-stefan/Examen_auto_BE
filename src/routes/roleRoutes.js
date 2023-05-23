import express from "express";
import RoleController from "../controllers/roleController.js";


const app = express();

app.post('/get-role-by-name', async (req, res) => {
    await RoleController.getRoleByName(req, res)
})

export default app