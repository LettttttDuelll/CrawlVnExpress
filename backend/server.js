//Instagram: c7k48.kukukaka

import express from "express";
import bodyParser from "body-parser";
import { run } from "./test.js";
import { main } from "./MongoDB.js";
import { main1 } from "./baonghean/db.js";
import cron from "node-cron";
const app = express();
import cors from "cors";
app.use(bodyParser.json());
app.use(cors());
app.post("/crawl", async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }
});

try {
    const data = await main(url); //
    res.json({ success: true, message: data });
    res.json(data);
}
catch (err) {
    console.error("Crawler error:", err);
    res.status(500).json({ error: "Crawler failed" });
};

app.listen(8080, () => { console.log("Server running at http://localhost:8080"); });

cron.schedule("0 6 * * *", async () => {
    await main("https://vnexpress.net");//await để đợi hàm main hoàn thành 
    await main1(); 
    console.log("🔄 Cron job executed at 6:00 AM");
})
