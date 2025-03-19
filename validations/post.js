import {body} from "express-validator";

export const postCreateValidation = [
    body('title', 'Введите заголовок').isLength({min: 1}).isString(),
    body('title', 'Введите текст').isLength({min: 1}).isString(),
    body('tags', 'Введите тег').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]