import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import * as XLSX from "xlsx";
import { urls } from "./urls.js";

const scrape = async (url, browser) => {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector("main.min-h-screen", { timeout: 15000 });

    const html = await page.content();
    const $ = cheerio.load(html);

    const product = {};

    // --- Cheerio lấy thông tin dựa theo label ---
    product.title = $("h1").first().text().trim() || null;

    $("h4").each((i, el) => {
      const label = $(el).text().trim();
      const value = $(el).next("div").find("p").text().trim() || $(el).parent().find("p").text().trim();
      if (/Mã sản phẩm/i.test(label)) {
        product.id = value;
      }
      if (/Chất liệu/i.test(label)) {
        product.material = value;
      }
      if (/Phù hợp/i.test(label)) {
        product.usage = value;
      }
      if (/Bảo quản/i.test(label)) {
        product.note = value;
      }
    });

    // Giá sale + giá gốc
    product.salePrice = $("span.text-xl.font-bold.text-primary").first().text().trim() || null;
    product.price = $("del.text-gray-400").first().text().trim() || null;

    // Phần trăm giảm giá
    product.sale = $("div.flex.items-center.gap-1 span").first().text().trim() || null;

    // Mô tả ngắn
    product.description = $("p.text-sm").first().text().trim() || null;

    // Ảnh sản phẩm
    product.img = [];
    $("div.no-scrollbar.absolute.left-5 button img").each((_, el) => {
      const src = $(el).attr("src");
      if (src) product.img.push(src);
    });

    return { url, ...product };
  } catch (err) {
    console.error(`❌ Lỗi scrape ${url}:`, err.message);
    return null;
  } finally {
    await page.close();
  }
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: true });
  let results = [];

  for (let i = 0; i < urls.length; i++) {
    console.log(`Scraping: ${urls[i]} (${i + 1}/${urls.length})`);
    const data = await scrape(urls[i], browser);
    if (data) results.push(data);
    await new Promise(r => setTimeout(r, 1000)); // tránh bị block
  }

  // Xuất Excel
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
    Images: item.img.join(", ")
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  XLSX.writeFile(workbook, "products2.xlsx");
  console.log("✅ Xuất file Excel thành công: products2.xlsx");

  await browser.close();
};

run();
