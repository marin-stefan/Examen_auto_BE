import { check } from "express-validator";
import roleSchema from "../schemas/roleSchema.js";
import userSchema from "../schemas/userSchema.js";

const userValidator = {
    createRequest: () => {
        return [
            check('firstName')
                .exists()
                .withMessage('Numele este necesar')
                .trim()
                .notEmpty()
                .isLength({min: 2, max: 15})
                .withMessage('Numele trebuie sa aiba minim 2 caractere sau maxim 15 caractere.'),

            check('lastName',)
                .exists()
                .withMessage('Prenumele este necesar')
                .trim()
                .isLength({min: 2, max: 15})
                .withMessage('Prenumele trebuie sa aiba minim 2 caractere sau maxim 15 caractere.'),

            check('email',)
                .exists()
                .withMessage('Adresa de email este necesara')
                .isEmail()
                .withMessage('Adresa de email este invalida.')
                .custom(async email => {
                    await userSchema.findOne({ email: email })
                        .then(user => {
                            if (user !== null) return Promise.reject();
                        }) 
                })
                .withMessage('Adresa de email deja folosita'),

            check('password',)
                .exists()
                .withMessage('Parola este necesara')
                .trim()
                .isLength({min: 8})
                .withMessage('Parola trebuie sa aiba minim 8 caractere.'),

            check('username',)
                .exists()
                .withMessage('Alias utilizator este necesar')
                .trim()
                .isLength({min: 4, max: 15})
                .withMessage('Alias utilizator trebuie sa aiba minim 4 caractere sau maxim 15 caractere.')
                .custom(async username => {
                    await userSchema.findOne({ username: username })
                        .then(user => {
                            if (user !== null) return Promise.reject();
                        })
                })
                .withMessage('Acest alias utilizator este deja folosit'),

            check('roleId')
                .exists()
                .withMessage('Id tip utilizator este necesar')
                .trim()
                .custom(async role => {
                    await roleSchema.find({ name: role })
                        .then(roleId => {
                            return roleId === null;
                        })
                })
                .withMessage('Acest Id tip utilizator nu exista')
        ]
    },

    updateRequest: () => {
        return [
            check('firstName')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Numele nu poate fi gol')
                .isLength({min: 2, max: 15})
                .withMessage('Numele trebuie sa aiba minim 2 caractere sau maxim 15 caractere.'),

            check('lastName',)
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Prenumele nu poate fi gol')
                .isLength({min: 2, max: 15})
                .withMessage('Prenumele trebuie sa aiba minim 2 caractere sau maxim 15 caractere.'),

            check('email',)
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Adresa de email nu poate fi goala')
                .isEmail()
                .withMessage('Adresa de email este invalida.'),

            check('password')
                .optional()
                .trim(),

            check('username')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Alias utilizator nu poate fi gol')
                .isLength({min: 4, max: 15})
                .withMessage('Alias utilizator trebuie sa aiba minim 4 caractere sau maxim 15 caractere.')
                .custom(async username => {
                    await userSchema.find({ username: username })
                        .then(user => {
                            return user === null;
                        })
                })
                .withMessage('Alias utilizator este deja folosit'),

            check('roleId')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Id tip utilizator este necesar')
                .custom(async role => {
                    await roleSchema.find({ name: role })
                        .then(roleId => {
                            return roleId === null;
                        })
                })
                .withMessage('Acest Id tip utilizator nu exista')
        ]
    },

    loginRequest: () => {
        return [
            check('username')
                .exists()
                .withMessage('Alias utilizator este necesar')
                .trim()
                .notEmpty()
                .withMessage('Alias utilizator nu poate fi gol')
                .escape(),
                
            check('password')
                .exists()
                .withMessage('Parola este necesara')
                .trim()
                .notEmpty()
                .withMessage('Parola nu poate fi goala')
                .escape()
        ]
    }
}


export default userValidator;