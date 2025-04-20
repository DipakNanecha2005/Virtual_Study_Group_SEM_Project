import { UserModel } from "../models/User.model.js";

export const searchContacts = async (req, res) => {
    try {
        const { searchString } = req.body;
        if (searchString === undefined || searchString === null || searchString === "") {
            return res.status(400).json({
                error: "searchString is required",
                success: false
            });
        }
        console.log({ searchString });

        const regex = new RegExp(searchString, "i");
        const contacts = await UserModel.find({
            $and: [
                { _id: { $ne: req.userId } }, // id !== req.userId
                {
                    $or: [{ fullName: regex }, { username: regex }, { email: regex }]
                }
            ]
        });
        const users = await UserModel.find({});
        return res.status(200).json({ contacts });
    } catch (error) {
        console.log("Error in searchContacts controller:", error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}