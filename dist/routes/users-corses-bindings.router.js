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
exports.getUsersCoursesBindingsRouter = exports.mapEntityTyViewModel = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils/utils");
const express_validator_1 = require("express-validator");
const mapEntityTyViewModel = (dbEntity, user, course) => {
    return {
        userId: dbEntity.userId,
        courseId: dbEntity.courseId,
        userName: user.userName,
        courseTitle: course.title
    };
};
exports.mapEntityTyViewModel = mapEntityTyViewModel;
const getUsersCoursesBindingsRouter = (db) => {
    const router = express_1.default.Router();
    const usersCoursesBindingsValidation = (0, express_validator_1.body)('userName')
        .trim().isLength({ min: 3, max: 10 })
        .withMessage('Ты прислал либо пустую строку, либо много символов! Минимум 3, максимум 10 символов!');
    router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = db.users.find(u => u.userId === req.body.userId);
        const course = db.courses.find(c => c.courseId === req.body.courseId);
        if (!user || !course) {
            res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const alreadyExistedBinding = db
            .userCourseBinding.find(b => b.userId === user.userId && b.courseId === course.courseId);
        if (!!alreadyExistedBinding) {
            res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const createUserCourseBinding = {
            userId: user.userId,
            courseId: course.courseId,
            date: new Date()
        };
        db.userCourseBinding.push(createUserCourseBinding);
        res
            .status(utils_1.HTTP_STATUSES.CREATED_201)
            .json((0, exports.mapEntityTyViewModel)(createUserCourseBinding, user, course));
    }));
    return router;
};
exports.getUsersCoursesBindingsRouter = getUsersCoursesBindingsRouter;
