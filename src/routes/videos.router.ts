import express, {Response} from 'express';
import {HTTP_STATUSES} from "../utils/utils";
import {UserViewModel} from "../models/Users/UserViewModel";
import {DBType, UsersType, VideosType} from "../db/db";
import {RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types/types";
import {QueryVideoModel} from "../models/Videos/QueryVideosModel";
import {URIParamsVideoIdModel} from "../models/Videos/URIParamsVideoIdModel";
import {UpdateVideoModel} from "../models/Videos/UpdateVideoModel";
import {CreateVideoModel} from "../models/Videos/CreateVideoModel";

export const mapEntityTyViewModel = (dbEntity: UsersType): UserViewModel => {
    return {
        userId: dbEntity.userId,
        userName: dbEntity.userName
    }
}

export const getVideoRouter = (db: DBType) => {

    const router = express.Router()

    router.get('/', (req: RequestWithQuery<QueryVideoModel>, res: Response<VideosType[]>) => {
        let foundVideos = db.videos

        if (req.query.title) {
            foundVideos = foundVideos
                .filter(v => v.title!.indexOf(req.query.title as string) > -1)
        }
        res.json(foundVideos)
    })
    router.get('/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response<VideosType>) => {
        const foundVideo = db.videos.find(v => v.id === +req.params.id);

        if (!foundVideo) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(foundVideo)
    })
    router.post('/', (req: RequestWithParams<CreateVideoModel>, res: Response<VideosType>) => {

        if (!req.body.title || !req.body.author) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json({
                    errorsMessages: [
                        {
                            message: 'Пустой title',
                            field: 'Пустой author'
                        }
                    ]
                })
            return;
        }
        const createVideo = {
            id: +(new Date()),
            title: req.body.title,
            author: req.body.author,
            availableResolutions: req.body.availableResolutions,
            canBeDownloaded: true,
            minAgeRestriction: req.body.minAgeRestriction ? req.body.minAgeRestriction : null,
            createdAt: String(new Date()),
            publicationDate: String(new Date())
        }
        db.videos.push(createVideo)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(createVideo)
    })
    router.delete('/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response<VideosType>) => {
        const id = +req.params.id;
        const videoExists = db.videos.some(v => v.id === id);

        if (!videoExists) {
            res
                .status(HTTP_STATUSES.NOT_FOUND_404)
                .send('Такого видео не найдено' as unknown as VideosType);
            return;
        }

        db.videos = db.videos.filter(v => v.id !== id);
        res.status(HTTP_STATUSES.NO_CONTENT_204).send('Видео успешно удалено!' as unknown as VideosType);
    });
    router.put('/:id',(req: RequestWithParamsAndBody<URIParamsVideoIdModel, UpdateVideoModel>, res: Response<VideosType | null>) => {
        if (!req.body.title || !req.body.author) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json({
                    errorsMessages: [
                        {
                            message: 'Пустой title',
                            field: 'Пустой author'
                        }
                    ]
                })
            return;
        }
        const foundVideo = db.videos.find(v => v.id === +req.params.id)
        if (!foundVideo) {
            res
                .status(HTTP_STATUSES.NOT_FOUND_404)
                .json({
                    errorsMessages: [
                        {
                            message: 'Такого видео не найдено',
                            field: 'Пустой author'
                        }
                    ]
                })
            return;
        }
        foundVideo.title = req.body.title

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router
}