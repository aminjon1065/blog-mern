import {body} from "express-validator";

export const registerValidator = [
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters"),
    body('fullName').isLength({min: 6}).withMessage("Full name is required"),
    body('avatarUrl').optional().isURL()
]

export const loginValidator = [
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({min: 6}).withMessage("Password is required"),
]
