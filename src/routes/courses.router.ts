import express, { Request, Response } from 'express';
import {CoursesType, DBType, UsersType} from "../db/db";
import {HTTP_STATUSES} from "../utils/utils";
import {CourseViewModel} from "../models/Courses/CourseViewModel";
import { body, validationResult } from 'express-validator';
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types/types";
import {QueryCourseModel} from "../models/Courses/QueryCoursesModel";
import {URIParamsCourseIdModel} from "../models/Courses/URIParamsCourseIdModel";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {CreateCourseModel} from "../models/Courses/CreateCourseModel";
import {UpdateCourseModel} from "../models/Courses/UpdateCourseModel";

export const mapEntityTyViewModel = (dbEntity: CoursesType): CourseViewModel => {
    return {
        courseId: dbEntity.courseId,
        title: dbEntity.title
    }
}

export const getCoursesRouter = (db: DBType) => {

    const router = express.Router()
    const titleValidation = body('title').trim().isLength({ min: 3, max: 30 }).withMessage('Ты прислал либо пустую строку, либо много символов! Минимум 3, максимум 10 символов!')

    router.get('/', (req: RequestWithQuery<QueryCourseModel>, res: Response<CoursesType[]>) => {
        let foundCourses = db.courses

        if(req.query.title){
            foundCourses = foundCourses
                .filter( c => c.title.indexOf(req.query.title as string) > -1)
        }

        res.json(foundCourses)
    })
    router.get('/:courseId', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CoursesType>) => {
        const foundCourse = db.courses.find(c => c.courseId === +req.params.courseId);

        if(!foundCourse){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(foundCourse)
    })
    router.post('/', titleValidation, inputValidationMiddleware, async (req: RequestWithBody<CreateCourseModel>, res: Response<CoursesType>) => {
        if(!req.body.title){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }
        const createCourse = {
            courseId: +(new Date()),
            title: req.body.title
        }
        db.courses.push(createCourse)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(createCourse)
    })
    router.delete('/:courseId', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CoursesType>) => {
        const courseId = +req.params.courseId;
        const courseExists = db.courses.some(c => c.courseId === courseId);

        if (!courseExists) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Такого курса не найдено' as unknown as CoursesType);
            return;
        }

        db.courses = db.courses.filter(c => c.courseId !== courseId);
        res.status(HTTP_STATUSES.OK_200).send('Курс успешно удален!' as unknown as CoursesType);
    });
    router.put('/:courseId', titleValidation, inputValidationMiddleware, async (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>, res: Response<CoursesType | null>) => {
        if(!req.body.title){
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .send('Не корректный запрос на обновление!' as unknown as CoursesType);
            return;
        }
        const foundCourses = db.courses.find(c => c.courseId === +req.params.courseId)
        if(!foundCourses){
            res
                .status(HTTP_STATUSES.NOT_FOUND_404)
                .send('Такого курса не найдено' as unknown as CoursesType);
            return;
        }
        foundCourses.title = req.body.title

        res
            .json(foundCourses)
            .status(HTTP_STATUSES.OK_200)
    })

    return router
}