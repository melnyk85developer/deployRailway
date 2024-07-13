"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersRouter = exports.mapEntityTyViewModel = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils/utils");
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const mapEntityTyViewModel = (dbEntity) => {
    return {
        userId: dbEntity.userId,
        userName: dbEntity.userName
    };
};
exports.mapEntityTyViewModel = mapEntityTyViewModel;
const getUsersRouter = (db) => {
    const router = express_1.default.Router();
    const userNameValidation = (0, express_validator_1.body)('userName').trim().isLength({ min: 3, max: 10 }).withMessage('Ты прислал либо пустую строку, либо много символов! Минимум 3, максимум 10 символов!');
    router.get('/', (req, res) => {
        let foundUsers = db.users;
        if (req.query.userName) {
            foundUsers = foundUsers
                .filter(u => u.userName.indexOf(req.query.userName) > -1);
        }
        res.json(foundUsers);
    });
    router.get('/:userId', (req, res) => {
        const foundUser = db.users.find(c => c.userId === +req.params.userId);
        if (!foundUser) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(foundUser);
    });
    router.post('/', userNameValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body.userName) {
            res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const createUser = {
            userId: +(new Date()),
            userName: req.body.userName
        };
        db.users.push(createUser);
        res
            .status(utils_1.HTTP_STATUSES.CREATED_201)
            .json(createUser);
    }));
    router.delete('/:userId', (req, res) => {
        const userId = +req.params.userId;
        const userExists = db.users.some(c => c.userId === userId);
        if (!userExists) {
            res.status(utils_1.HTTP_STATUSES.NOT_FOUND_404).send('Такого пользователя не найдено');
            return;
        }
        db.users = db.users.filter(c => c.userId !== userId);
        res.status(utils_1.HTTP_STATUSES.OK_200).send('Пользователь успешно удален!');
    });
    router.put('/:userId', userNameValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body.userName) {
            res
                .status(utils_1.HTTP_STATUSES.BAD_REQUEST_400)
                .send('Не корректный запрос на обновление!');
            return;
        }
        const foundUser = db.users.find(c => c.userId === +req.params.userId);
        if (!foundUser) {
            res
                .status(utils_1.HTTP_STATUSES.NOT_FOUND_404)
                .send('Такого пользователя не найдено');
            return;
        }
        foundUser.userName = req.body.userName;
        res
            .json(foundUser)
            .status(utils_1.HTTP_STATUSES.OK_200);
    }));
    return router;
};
exports.getUsersRouter = getUsersRouter;
