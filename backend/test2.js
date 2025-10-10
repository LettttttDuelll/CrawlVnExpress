import puppeteer from "puppeteer";
import { urls } from "./urls.js";
import * as XLSX from "xlsx";

const scrape = async (url, browser) => {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector("main.min-h-screen", { timeout: 15000 });

    return await page.evaluate(() => {
      const tab = document.querySelectorAll("ul.mt-5.py-2 li p");
      const arr = Array.from(tab).map(el => el.innerText.trim());

      const id = document.querySelector("p.line-clamp-3.font-sans")?.innerText || null;
      const title = document.querySelector("h1.line-clamp-3")?.innerText || null;
      const price = document.querySelector("del.font-sans")?.innerText.trim() || null;
      const salePrice = document.querySelector("div.flex.items-center.gap-2 p")?.innerText || null;
      const pictures = document.querySelectorAll("div.no-scrollbar.absolute.left-5 button img");
      const img = [...pictures].map(im => im.src);
      const sale = document.querySelector("div.flex.items-center.gap-1 span")?.innerText || null;
      const material = arr[1] || null;
      const usage = arr[3] || null;
      const note = arr[4] || null;
      const description = document.querySelector("p.text-sm")?.innerText || null;

      return { id, title, price, sale, salePrice, img, description, material, usage, note };
    });
  } catch (err) {
    console.error(`❌ Lỗi khi scrape ${url}:`, err.message);
    return null;
  } finally {
    await page.close(); // đóng tab sau khi scrape xong
  }
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: true });
  let results = [];

  for (let i = 0; i < urls.length; i++) {
    console.log(`Scraping: ${urls[i]} (${i + 1}/${urls.length})`);
    const data = await scrape(urls[i], browser);
    if (data) {
      results.push({ url: urls[i], ...data });
    }
    // thêm delay nhỏ để tránh bị block
    await new Promise(r => setTimeout(r, 1000));
  }

  // 🔹 Xuất ra Excel
  const worksheet = XLSX.utils.json_to_sheet(results.map(item => ({
    URL: item.url,
    ID: item.id,
    Title: item.title,
    Price: item.price,
    Sale: item.sale,
    SalePrice: item.salePrice,
    Description: item.description,
    Material: item.material,
    Usage: item.usage,
    Note: item.note,
    Images: item.img.join(", ") // gộp nhiều ảnh thành 1 ô
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  XLSX.writeFile(workbook, "products1.xlsx");

  console.log("✅ Xuất file Excel thành công: products1.xlsx");

  await browser.close();
};

run();
