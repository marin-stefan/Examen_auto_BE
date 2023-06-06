import User from "../schemas/userSchema.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import HttpStatuses from "../enums/httpStatusesEnum.js";
import logger from "../services/logger.js";


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

                const jwtKey = process.env.JWT_SECRET_KEY || 'marin_licenta_secret'
                const token = jsonwebtoken.sign(
                    { user: response },
                    jwtKey,
                    { algorithm: 'HS256' }
                )

                return res.status(HttpStatuses.Ok).json({ token: token })
        } catch (error) {
            logger.error(error.message);
            res.status(HttpStatuses.ServerError).json({message: error.message})
        }
    },

    create: (req, res) => {
        const userInputs = req.body;

        userInputs._id = new mongoose.Types.ObjectId();

        const newUser = new User(userInputs);
        newUser.save().then((user) => {
            res.status(HttpStatuses.Created).send({ user: user, success: true })
        }).catch(error => {
            logger.error(error.message);
            res.status(HttpStatuses.ServerError).json({ message: error.message })
        })
    },

    getUserById: async (req, res) => {
        try {
            let user = await User.findById(req.params.id);
            if (null == user) {
                res.status(HttpStatuses.NotFound).send(`User with ${req.params.id} was not found`)
            }
            res.status(HttpStatuses.Ok).json(user);
        } catch (error) {
            logger.error(error.message);
            res.status(HttpStatuses.ServerError).json({ message: error.message });
        }
    },

    updateUser: async (req, res) => {

       try {
            const filter = { _id: req.body._id };
            const update = 
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    username: req.body.username,
                };

            if (req.body.password) {
                update['password'] = req.body.password
            }
            
            let user = await User.findOneAndUpdate(filter, update)
            
            res.status(HttpStatuses.Created).send({ success: true });
       } catch (error) {
            logger.error(error.message);
            res.status(HttpStatuses.ServerError).json({ message: error.message })
       }
    },

    getUserStatsById: async (req, res) => {
        try {
            let user = await User.findById(req.params.id);
            if (null == user) {
                res.status(HttpStatuses.NotFound).send(`User with ${req.params.id} was not found`)
            }

            const stats = [
                {
                  title: "Examene sustinute",
                  additional: "Total examene sustinute in platforma",
                  count: user.totalExams,
                },
                {
                  title: "Examene promovate",
                  additional: "Total examene promovate din cele sustinute",
                  count: user.totalPassedExams,
                  percentage: ((user.totalPassedExams / user.totalExams) * 100).toFixed(2) | 0,
                },
                {
                  title: "Punctaj mediu obtinut",
                  additional: "Media punctaj obtinut in platforma",
                  count: (26 - (((26 * user.totalExams) - (user.correctAnswers)) / user.totalExams)).toFixed(2) | 0,
                },
                {
                  title: "Total raspunsuri corecte ",
                  additional: "Bazat pe toate examenele sustinute",
                  count: user.correctAnswers,
                  percentage: ((user.correctAnswers / (user.totalExams * 26)) * 100).toFixed(2) | 0,
                },
              ]

            res.status(HttpStatuses.Ok).json(stats);

        } catch (error) {
            logger.error(error.message);
            res.status(HttpStatuses.ServerError).json({ message: error.message });
        }
    },



}

export default UserController;