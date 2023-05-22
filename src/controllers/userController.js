import User from "../schemas/userSchema";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import HttpStatuses from "../enums/httpStatusesEnum.js";


const UserController = {
    
    login: async (req, res) => {
        try {
            let user = await User.findOne({username: req.body.username})
                .populate('type', {_id: 0, id: 0});
                if (!user) return res.status(HttpStatuses.Unauthorized).send('Invalid username or password')

                const validPassword = await bcrypt.compare(req.body.password, user.password);
                if (!validPassword) return res.status(HttpStatuses.Unauthorized).send('Invalid username or password')

                let response = {
                    id: user._id,
                    role: user.type.name,
                    name: user.firstName,
                }

                // if (response.role === )

                const jwtKey = process.env.JWT_SECRET_KEY || 'marin_licenta_secret'
                const token = jsonwebtoken.sign(
                    { user: response },
                    jwtKey,
                    { algoritm: 'HS256' }
                )

                return res.status(HttpStatuses.Ok).json({ token: token })
        } catch (error) {
            logger.error(error.message);
            res.status(HttpStatuses.ServerError).json({message: error.message})
        }
    }
}

export default UserController;