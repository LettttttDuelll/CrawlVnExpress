import puppeteer from "puppeteer";
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import News from './models/news.js'; // nếu có mongoose model

dotenv.config();
const uri = process.env.linkdb;

async function crawlData() {
    const url = "https://vnexpress.net/thoi-su/80-nam-quoc-khanh-p4";
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("article.item-news");

    const datas = await page.$$eval("article.item-news", els =>
        els.map(el => {
            const title = el.querySelector(".title-news a")?.textContent.trim() || "";
            const description = el.querySelector(".description a")?.textContent.trim() || "";
            const img = el.querySelector("img")?.getAttribute("data-src") || "";
            return { title, description, img };
        })
    );

    await browser.close();
    return datas;
}

async function saveToMongo(datas) {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db("news");
        const collection = db.collection("vnexpress");

        const result = await collection.insertMany(datas);
        console.log(`✅ Inserted ${result.insertedCount} documents`);
    } finally {
        await client.close();
    }
}

async function run() {
    const datas = await crawlData();
    console.log("📌 Crawled:", datas.length, "items");
    await saveToMongo(datas);
}

run().catch(console.error);
