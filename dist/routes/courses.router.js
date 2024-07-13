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
exports.getCoursesRouter = exports.mapEntityTyViewModel = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils/utils");
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const mapEntityTyViewModel = (dbEntity) => {
    return {
        courseId: dbEntity.courseId,
        title: dbEntity.title
    };
};
exports.mapEntityTyViewModel = mapEntityTyViewModel;
const getCoursesRouter = (db) => {
    const router = express_1.default.Router();
    const titleValidation = (0, express_validator_1.body)('title').trim().isLength({ min: 3, max: 30 }).withMessage('Ты прислал либо пустую строку, либо много символов! Минимум 3, максимум 10 символов!');
    router.get('/', (req, res) => {
        let foundCourses = db.courses;
        if (req.query.title) {
            foundCourses = foundCourses
                .filter(c => c.title.indexOf(req.query.title) > -1);
        }
        res.json(foundCourses);
    });
    router.get('/:courseId', (req, res) => {
        const foundCourse = db.courses.find(c => c.courseId === +req.params.courseId);
        if (!foundCourse) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(foundCourse);
    });
    router.post('/', titleValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body.title) {
            res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const createCourse = {
            courseId: +(new Date()),
            title: req.body.title
        };
        db.courses.push(createCourse);
        res
            .status(utils_1.HTTP_STATUSES.CREATED_201)
            .json(createCourse);
    }));
    router.delete('/:courseId', (req, res) => {
        const courseId = +req.params.courseId;
        const courseExists = db.courses.some(c => c.courseId === courseId);
        if (!courseExists) {
            res.status(utils_1.HTTP_STATUSES.NOT_FOUND_404).send('Такого курса не найдено');
            return;
        }
        db.courses = db.courses.filter(c => c.courseId !== courseId);
        res.status(utils_1.HTTP_STATUSES.OK_200).send('Курс успешно удален!');
    });
    router.put('/:courseId', titleValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body.title) {
            res
                .status(utils_1.HTTP_STATUSES.BAD_REQUEST_400)
                .send('Не корректный запрос на обновление!');
            return;
        }
        const foundCourses = db.courses.find(c => c.courseId === +req.params.courseId);
        if (!foundCourses) {
            res
                .status(utils_1.HTTP_STATUSES.NOT_FOUND_404)
                .send('Такого курса не найдено');
            return;
        }
        foundCourses.title = req.body.title;
        res
            .json(foundCourses)
            .status(utils_1.HTTP_STATUSES.OK_200);
    }));
    return router;
};
exports.getCoursesRouter = getCoursesRouter;
