
export type CoursesType = {
    courseId: number
    title: string
}
export type UsersType = {
    userId: number
    userName: string
}
export type userCourseBindingType = {
    userId: number
    courseId: number
    date: any
}
export type ErrorsMessageType = {
    message: string,
    field: string
}
export type VideosType = {
    id?: number,
    title?: string,
    author?: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: any,
    createdAt?: string,
    publicationDate?: string,
    availableResolutions?: Array<string>,

    errorsMessages?: Array<ErrorsMessageType>
}
export type ProductType = {
    courses: CoursesType[]
    users: UsersType[]
    userCourseBinding: userCourseBindingType[]
    videos: VideosType[]
}
export const db: DBType = {
    courses : [
        {courseId: 1, title: 'front-end'},
        {courseId: 2, title: 'back-end'},
        {courseId: 3, title: 'automation qa'},
        {courseId: 4, title: 'devops'}
    ],
    users : [
        {userId: 1, userName: 'Masikus'},
        {userId: 2, userName: 'Dimych'},
        {userId: 3, userName: 'Viktor'},
    ],
    userCourseBinding : [
        {userId: 1, courseId: 1, date: new Date(22,10,1)},
        {userId: 1, courseId: 2, date: new Date(22,10,1)},
        {userId: 2, courseId: 3, date: new Date(22,10,1)},
        {userId: 3, courseId: 4, date: new Date(22,10,1)},
    ],
    videos : [
        {
            id: 1,
            title: 'Course 1',
            author: 'Masikus',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2024-07-12T22:54:10.111Z",
            publicationDate: "2024-07-12T22:54:10.111Z",
            availableResolutions: ["P144"]
        },
    ]
}
export type DBType = ProductType