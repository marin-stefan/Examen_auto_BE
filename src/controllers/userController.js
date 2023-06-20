import User from "../schemas/userSchema.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import HttpStatuses from "../enums/httpStatusesEnum.js";
import logger from "../services/logger.js";


const UserController = {
    
    login: async (req, res) => {
        try {
            let user = await User.findOne({username: req.body.username}).populate('type', {_id: 0, id: 0});
                if (!user) {
                    return res.status(HttpStatuses.Unauthorized).send('Invalid username or password')
                }

                const validPassword = await bcrypt.compare(req.body.password, user.password);
                if (!validPassword) {
                    return res.status(HttpStatuses.Unauthorized).send('Invalid username or password')
                }

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
            let user = await User.findById(req.body._id);
            const updates = {};

            const options = ['firstName', 'lastName', 'email', 'username', 'password'];
            options.forEach(value => {
                if (req.body[value]) {
                    updates[value] = req.body[value];
                }
            });

            const stats = ['totalExams', 'totalPassedExams', 'correctAnswers', 'wrongAnswers'];
            stats.forEach(value => {
                if (req.body[value]) {
                    updates[value] = user[value] + req.body[value]
                }
            })
            
            let updatedUser = await User.findOneAndUpdate(filter, updates)
            
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
                  title: "Examene susţinute",
                  additional: "Total examene susţinute în platformă",
                  count: user.totalExams,
                },
                {
                  title: "Examene promovate",
                  additional: "Total examene promovate din cele susţinute",
                  count: user.totalPassedExams,
                  percentage: ((user.totalPassedExams / user.totalExams) * 100).toFixed(2),
                },
                {
                  title: "Punctaj mediu obţinut",
                  additional: "Media punctaj obţinut in platformă",
                  count: (user.correctAnswers / user.totalExams).toFixed(2),
                },
                {
                  title: "Total răspunsuri corecte ",
                  additional: "Bazat pe toate examenele susţinute",
                  count: user.correctAnswers,
                  percentage: ((user.correctAnswers / (user.correctAnswers + user.wrongAnswers)) * 100).toFixed(2),
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