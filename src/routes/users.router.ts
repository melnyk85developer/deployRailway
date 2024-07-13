import express, {Request, Response} from 'express';
import {HTTP_STATUSES} from "../utils/utils";
import {UserViewModel} from "../models/Users/UserViewModel";
import {UsersType, DBType} from "../db/db";
import {RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types/types";
import { body, validationResult } from 'express-validator';
import {QueryUserModel} from "../models/Users/QueryUsersModel";
import {URIParamsUserIdModel} from "../models/Users/URIParamsUserIdModel";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {UpdateUserModel} from "../models/Users/UpdateUserModel";

export const mapEntityTyViewModel = (dbEntity: UsersType): UserViewModel => {
    return {
        userId: dbEntity.userId,
        userName: dbEntity.userName
    }
}

export const getUsersRouter = (db: DBType) => {

    const router = express.Router()
    const userNameValidation = body('userName').trim().isLength({ min: 3, max: 10 }).withMessage('Ты прислал либо пустую строку, либо много символов! Минимум 3, максимум 10 символов!')

    router.get('/', (req: RequestWithQuery<QueryUserModel>, res: Response<UsersType[]>) => {
        let foundUsers = db.users

        if (req.query.userName) {
            foundUsers = foundUsers
                .filter(u => u.userName.indexOf(req.query.userName as string) > -1)
        }

        res.json(foundUsers)
    })
    router.get('/:userId', (req: RequestWithParams<URIParamsUserIdModel>, res: Response<UsersType>) => {
        const foundUser = db.users.find(c => c.userId === +req.params.userId);

        if (!foundUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(foundUser)
    })
    router.post('/', userNameValidation, inputValidationMiddleware, async (req: RequestWithParams<{userName: string}>, res: Response<UsersType>) => {
        if (!req.body.userName) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }
        const createUser = {
            userId: +(new Date()),
            userName: req.body.userName
        }
        db.users.push(createUser)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(createUser)
    })
    router.delete('/:userId', (req: RequestWithParams<URIParamsUserIdModel>, res: Response<UsersType>) => {
        const userId = +req.params.userId;
        const userExists = db.users.some(c => c.userId === userId);

        if (!userExists) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Такого пользователя не найдено' as unknown as UsersType);
            return;
        }

        db.users = db.users.filter(c => c.userId !== userId);
        res.status(HTTP_STATUSES.OK_200).send('Пользователь успешно удален!' as unknown as UsersType);
    });
    router.put('/:userId', userNameValidation, inputValidationMiddleware, async(req: RequestWithParamsAndBody<URIParamsUserIdModel, UpdateUserModel>, res: Response<UsersType | null>) => {
        if (!req.body.userName) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .send('Не корректный запрос на обновление!' as unknown as UsersType);
            return;
        }
        const foundUser = db.users.find(c => c.userId === +req.params.userId)
        if (!foundUser) {
            res
                .status(HTTP_STATUSES.NOT_FOUND_404)
                .send('Такого пользователя не найдено' as unknown as UsersType);
            return;
        }
        foundUser.userName = req.body.userName

        res
            .json(foundUser)
            .status(HTTP_STATUSES.OK_200)
    })

    return router
}