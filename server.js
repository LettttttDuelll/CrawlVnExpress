import puppeteer from "puppeteer";
import fs from "fs";
const url = "https://vnexpress.net/";

const run = async () => {
    //Khởi chạy trình duyệt Chromium bằng Puppeteer.
    const browser = await puppeteer.launch({ headless: true });
    //Tạo một tab (Page) mới trong trình duyệt vừa khởi chạy.
    const page = await browser.newPage();
    //Điều hướng tab (page) tới địa chỉ url.
    await page.goto(url, { waitUntil: "networkidle2" });

    const articles = await page.$$eval(".item-news", els => els.map(el => {
        //els là 1 dom element, là 1 array chứa các phần tử DOM của các tin tức.
            const title = el.querySelector(".title-news a")?.textContent.trim() || "";//“tìm thẻ <a> bên trong một phần tử có class title-news”.
            const desc = el.querySelector(".description a")?.textContent.trim() || "";
            return {
                title: title,
                desc: desc,
            };
        })
    );

    console.log(articles);
    //Ghi dữ liệu vào file JSON
    fs.writeFileSync("news2.0.json", JSON.stringify(articles, null, 2));
    console.log("Dữ liệu đã được ghi vào file news.json");
    await browser.close();
};

run();
