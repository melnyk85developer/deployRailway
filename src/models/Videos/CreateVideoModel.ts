export type CreateVideoModel = {
    /**
     * title, author, availableResolutions
     */
    title: string
    author?: string
    availableResolutions?: Array<string>,
    canBeDownloaded?: false,
    minAgeRestriction?: null,
    createdAt?: string,
    publicationDate?: string
}
