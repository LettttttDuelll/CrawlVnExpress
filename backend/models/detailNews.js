import mongoose from "mongoose"

const detailNewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    tags: { type: [String] },//à, cái này là mảng
    content: { type: String, required: true },
    img: { type: String, required: true },
    imgName: { type: String, required: false },
    timeStamp: { type: Date, default: Date.now },
    author: { type: String, required: true },
    date: { type: String }
})
const DetailNews = mongoose.model("DetailNews", detailNewsSchema)
export default DetailNews