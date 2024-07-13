import express, {Response} from 'express';
import {HTTP_STATUSES} from "../utils/utils";
import {CoursesType, DBType, userCourseBindingType, UsersType} from "../db/db";
import {RequestWithBody} from "../types/types";
import {body} from 'express-validator';
import {UserCoursesBindingsViewModel} from "../models/UsersCoursesBindings/UserCoursesBindingsViewModel";
import {CreateUserCourseBindingModel} from "../models/UsersCoursesBindings/CreateUserCourseBindingModel";

export const mapEntityTyViewModel = (dbEntity: userCourseBindingType, user: UsersType, course: CoursesType): UserCoursesBindingsViewModel => {
    return {
        userId: dbEntity.userId,
        courseId: dbEntity.courseId,
        userName: user.userName,
        courseTitle: course.title
    }
}

export const getUsersCoursesBindingsRouter = (db: DBType) => {

    const router = express.Router()
    const usersCoursesBindingsValidation = body('userName')
        .trim().isLength({ min: 3, max: 10 })
        .withMessage('Ты прислал либо пустую строку, либо много символов! Минимум 3, максимум 10 символов!')

    router.post('/', async (req: RequestWithBody<CreateUserCourseBindingModel>,
                            res: Response<UserCoursesBindingsViewModel>) => {

        const user = db.users.find(u => u.userId === req.body.userId)
        const course = db.courses.find(c => c.courseId === req.body.courseId)

        if (!user || !course) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const alreadyExistedBinding = db
            .userCourseBinding.find(b => b.userId === user.userId && b.courseId === course.courseId)

        if (!!alreadyExistedBinding) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const createUserCourseBinding: userCourseBindingType = {
            userId: user.userId,
            courseId: course.courseId,
            date: new Date()
        }

        db.userCourseBinding.push(createUserCourseBinding)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(mapEntityTyViewModel(createUserCourseBinding, user, course))
    })
    return router
}