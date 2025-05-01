export const messageTypeVerifyMiddleware = (req, res, next) => {
    if (req.body.messageType === "text") return next();

    return upload.single("fileUrl")(req, res, next);
}