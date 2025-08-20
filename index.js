// index.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
// Sử dụng axios để lấy dữ liệu từ trang web và cheerio để phân tích cú pháp HTML
// Cài đặt các package này bằng npm install axios cheerio fs
const url = 'https://vnexpress.net/'; // URL của trang web cần lấy dữ liệu

const { data } = await axios.get(url);

const $ = cheerio.load(data); // load HTML

let newsList = []; // mảng để lưu trữ danh sách tin tức

$('.container').each((index, el) => {
    const titleNews = $(el).find('.title-news').text(); // lấy tiêu đề tin tức
    const des = $(el).find('.description').text(); // lấy mô tả tin tức

  newsList.push({
        title: titleNews, // lưu tiêu đề tin tức 
        description: des // lưu mô tả tin tức
    });
});
// Ghi dữ liệu vào file JSON
console.log(newsList); // in ra danh sách tin tức
fs.writeFileSync('news.json', JSON.stringify(newsList, null, 2)); // ghi dữ liệu vào file news.json
    console.log('Dữ liệu đã được ghi vào file news.json');
