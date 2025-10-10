import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { run } from './baoNghe.js';
import DetailNews1 from '../models/detailNews1.js';

dotenv.config();

const uri = process.env.linkdb;

//async function main(url) {
async function main1() {
    const today = new Date().toISOString().split('T')[0]; // "2025-09-04"
    try {
        // 1. Kết nối tới MongoDB qua Mongoose
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB via Mongoose!");

        const datas = await run();  // truyền url rõ ràng

        // 2. Lấy dữ liệu từ file test.js
        //const datas = await run(url);
        if (!datas || datas.length === 0) {
            console.log("⚠ Không có dữ liệu để import.");
            return;
        }

        // 3. Chuyển đổi thành mảng đối tượng News
        const data = datas.map(item => ({
            title: item.title,
            description: item.description,
            img: item.img,
            timeStamp: new Date(),
            author: item.author,
            date: today,
            category: item.category,
            content: item.content,
            tags: item.tags,
        }));

        // 4. Xóa dữ liệu cũ (nếu muốn làm mới)
        // await News.deleteMany({});

        // 5. Thêm dữ liệu mới
        const result = await DetailNews1.insertMany(data, { ordered: false });
        console.log(`✅ Imported ${result.length} documents`);
        return `✅ Imported ${result.length} documents`;
        //return result;

    } catch (error) {
        //console.error("❌ Lỗi khi import:", error);//console log lỗi nhưng dài quá
        if (error.code === 11000 && error.result) {
            // Trường hợp lỗi duplicate key, nhưng vẫn có document được thêm
            const insertedCount = error.result.insertedCount || (error.insertedDocs?.length ?? 0);
            console.log(`⚠ Có lỗi trùng lặp, nhưng vẫn import được ${insertedCount} documents.`);
        } else {
            console.error("❌ Lỗi khi import:", error);
        }
    } finally {
        // Đóng kết nối
        await mongoose.disconnect();
    }
}

// ─── CRON JOB: chạy 6h sáng hàng ngày ───
//cron.schedule("0 6 * * *", () => {
//main();
// console.log("🔄 Cron job executed at 6:00 AM");
//});
//main();
export { main1 };
main1();