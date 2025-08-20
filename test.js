import puppeteer from "puppeteer";
import fs from "fs";
const url = "https://vnexpress.net/thoi-su/80-nam-quoc-khanh-p4";

const run = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

   //await page.goto(url, { waitUntil: "networkidle2" });
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector("article.item-news");    

    const datas = await page.$$eval("article.item-news", els => els.map(el => {
        const title = el.querySelector(".title-news a")?.textContent || "";
        const desc = el.querySelector(".description a")?.textContent || "";
        const img = el.querySelector(".lazy.loading")?.src || "";
        return { title, desc, img };
    }));
    console.log(datas);

    fs.appendFileSync("news3.0.json", JSON.stringify(datas, null, 2) + "\n");

    console.log("Dữ liệu đã được ghi vào file news3.0.json");
    await browser.close();
};
run();