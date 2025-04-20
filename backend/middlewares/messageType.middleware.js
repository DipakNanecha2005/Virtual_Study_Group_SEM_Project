export const messageTypeVerifyMiddleware = (req, res, next) => {
    if(req.body.fileType === "text") return next();

    return upload.single("fileUrl")(req, res, next);
}