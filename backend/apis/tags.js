import { Tag } from '../models/index.js';

export const getTags = async (req, res) => {
    const keyword = req.query.keyword;
    const cnt = parseInt(req.query.cnt || 5);

    try {
        let query = Tag.find();
        if (keyword) {
            query = query.find({
                $and: keyword
                .split(" ")
                .map((key) => ({
                    "title": { $regex: new RegExp(key, "i") },
                })),
            });
        }

        return res.json(await query.limit(cnt).exec());
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
};