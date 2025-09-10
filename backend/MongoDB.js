import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { run } from './test.js';
import News from './models/news.js';
import DetailNews from './models/detailNews.js';

dotenv.config();

const uri = process.env.linkdb;

async function main() {
  const today = new Date().toISOString().split('T')[0]; // "2025-09-04"
  try {
    // 1. Kết nối tới MongoDB qua Mongoose
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB via Mongoose!");

    // 2. Lấy dữ liệu từ file test.js
    const datas = await run();
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
    }));

    // 4. Xóa dữ liệu cũ (nếu muốn làm mới)
    // await News.deleteMany({});

    // 5. Thêm dữ liệu mới
    const result = await DetailNews.insertMany(data);
    console.log(`✅ Imported ${result.length} documents`);

  } catch (error) {
    console.error("❌ Lỗi khi import:", error);
  } finally {
    // Đóng kết nối
    await mongoose.disconnect();
  }
}

main();
                  