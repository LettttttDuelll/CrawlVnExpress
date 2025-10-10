import mongoose from "mongoose"

const detailNewsSchema1 = new mongoose.Schema({
    //title: { type: String, required: true },
    title: { type: String, required: true, unique: true }, // ✅ thêm unique
    description: { type: String, required: true },
    category: { type: String },
    tags: { type: [String] },//à, cái này là mảng
    content: { type: String, required: true },
    img: { type: String, required: true },
    imgName: { type: String, required: false },
    timeStamp: { type: Date, default: Date.now },
    author: { type: String, required: false },
    date: { type: String }
})
const DetailNews1 = mongoose.model("DetailNews1", detailNewsSchema1)
export default DetailNews1