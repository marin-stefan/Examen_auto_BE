import { check } from "express-validator";
import roleSchema from "../schemas/roleSchema.js";
import userSchema from "../schemas/userSchema.js";

const userValidator = {
    createRequest: () => {
        return [
            check('firstName')
                .exists()
                .withMessage('Firstname is required')
                .trim()
                .notEmpty()
                .isLength({ min: 2, max: 15 })
                .withMessage('Firstname`s length must be between 2 and 15 characters long.'),

            check('lastName',)
                .exists()
                .withMessage('Lastname is required')
                .trim()
                .isLength({ min: 2, max: 15 })
                .withMessage('Latstname`s length must be between 2 and 15 characters long.'),

            check('email',)
                .exists()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Email is not valid.')
                .custom(async email => {
                    await userSchema.findOne({ email: email })
                        .then(user => {
                            if (user !== null) return Promise.reject();
                        }) 
                })
                .withMessage('Email already used'),

            check('password',)
                .exists()
                .withMessage('Password is required')
                .trim()
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long.'),

            check('username',)
                .exists()
                .withMessage('Username is required')
                .trim()
                .isLength({ min: 4, max: 15 })
                .withMessage('Usertname`s length must be between 4 and 15 characters long.')
                .custom(async username => {
                    await userSchema.findOne({ username: username })
                        .then(user => {
                            if (user !== null) return Promise.reject();
                        })
                })
                .withMessage('Username already used'),

            check('roleId')
                .exists()
                .withMessage('RoleId is required')
                .trim()
                .custom(async role => {
                    await roleSchema.find({ name: role })
                        .then(roleId => {
                            return roleId === null;
                        })
                })
                .withMessage('This roleId does not exist')
        ]
    },

    updateRequest: () => {
        return [
            check('firstName')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('FirstName can not be empty')
                .isLength({ min: 2, max: 15 })
                .withMessage('Firstname`s length must be between 2 and 15 characters long.'),

            check('lastName',)
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Lastname can not be empty')
                .isLength({ min: 2, max: 15 })
                .withMessage('Lastname`s length must be between 2 and 15 characters long.'),

            check('email',)
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Email can not be empty')
                .isEmail()
                .withMessage('Email is invalid.'),

            check('password')
                .optional()
                .trim(),

            check('username')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Username can not be empty')
                .isLength({ min: 4, max: 15 })
                .withMessage('Username`s length must be between 4 and 15 characters long.')
                .custom(async username => {
                    await userSchema.find({ username: username })
                        .then(user => {
                            return user === null;
                        })
                })
                .withMessage('Username is already used'),

            check('roleId')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('RoleId is required')
                .custom(async role => {
                    await roleSchema.find({ name: role })
                        .then(roleId => {
                            return roleId === null;
                        })
                })
                .withMessage('This roleId does not exist')
        ]
    },

    loginRequest: () => {
        return [
            check('username')
                .exists()
                .withMessage('Username is required')
                .trim()
                .notEmpty()
                .withMessage('Username can not be empty')
                .escape(),
                
            check('password')
                .exists()
                .withMessage('Password is required')
                .trim()
                .notEmpty()
                .withMessage('Password can not be empty')
                .escape()
        ]
    }
}


export default userValidator;