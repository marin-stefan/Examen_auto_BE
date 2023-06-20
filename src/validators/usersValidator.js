import { check } from "express-validator";

const usersValidator = {
    searchRequest: () => {
        return [
            check('lastName')
                .optional()
                .trim()
                .notEmpty()
                .withMessage("LastName can not be be empty")
                .custom((value, { req }) => value !== "null")
                .withMessage('LastName can not be null')
                .isAlpha()
                .withMessage('Lastname should be alphabetic')
        ]
    },
}


export default usersValidator;