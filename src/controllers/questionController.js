
import mongoose from "mongoose";
import Question from "../schemas/questionSchema.js";
import HttpStatuses from "../enums/httpStatusesEnum.js";
import logger from "../services/logger.js";

const QuestionController = {

    create: (req, res) => {
        const userInputs = req.body;
        userInputs._id = new mongoose.Types.ObjectId();
        const newQuestion = new Question (userInputs);

        newQuestion.save().then((question) => {
            res.status(HttpStatuses.Created).send({ question: question, success: true })
        }).catch(error => {
            logger.error(error.message);
            res.status(HttpStatuses.ServerError).json({ message: error.message })
        })
    },

    search: async (req, res) => {
        
        try {
            let questions = await Question.aggregate([{ $sample: { size: 26} }]);

            return res.status(HttpStatuses.Ok).json(questions)
        } catch (error) {
            logger.error(error.message);
            res.status(HttpStatuses.ServerError).json({ message: error.message })
        }
    },

    // updateQuestion: async (req, res) => {

    //     try {
    //          const filter = { _id: req.body._id };
    //          const update = 
    //              {
    //                 name: req.body.name,
    //                 text: req.body.text,
    //                 answers: req.body.answers,
    //                 correct: req.body.correct
    //              };
    //          let question = await Question.findOneAndUpdate(filter, update);
    //          res.status(HttpStatuses.Created).send({ success: true });
    //     } catch (error) {
    //          logger.error(error.message);
    //          res.status(HttpStatuses.ServerError).json({ message: error.message })
    //     }
    //  },

}

export default QuestionController;