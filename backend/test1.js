//lấy link sản phẩm
import puppeteer from "puppeteer";
//const puppeteer = require("puppeteer");


const url = "https://www.coolmate.me/collection/phu-kien-nu";

export const run = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await scrollUntilEnd(page);
    await page.waitForSelector("div.relative.w-full.shrink-0.grow-0");
    const links = await page.$$eval("div.relative.w-full.shrink-0.grow-0", els => els.map(el => {//nó là 1 list
        const linkEl = el.querySelector("a")?.href;
        return linkEl || 'No link found';
    }));

    links.forEach(element => {
        console.log(element);
    });
    console.log(links.length);

    await browser.close();
};
// Hàm scroll liên tục cho đến khi hết sản phẩm load thêm
async function scrollUntilEnd(page) {
    let previousHeight = await page.evaluate("document.body.scrollHeight");
    while (true) {
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
        await new Promise(r => setTimeout(r, 20000)); // chờ 2 giây để load thêm
        let newHeight = await page.evaluate("document.body.scrollHeight");
        if (newHeight === previousHeight) {
            break; // không còn load thêm
        }
        previousHeight = newHeight;
    }
}
run();
