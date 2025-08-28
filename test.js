import puppeteer from "puppeteer";
const url = "https://vnexpress.net/thoi-su/80-nam-quoc-khanh-p4";

export const run = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector("article.item-news");    

    const datas = await page.$$eval("article.item-news", els => els.map(el => {
        const title = el.querySelector(".title-news a")?.textContent || "1";
        const description = el.querySelector(".description a")?.textContent || "1";
        const img = el.querySelector(".lazy.loading")?.src || "1";
        return { title, description, img };
    }));

    await browser.close();
    return datas;  
};