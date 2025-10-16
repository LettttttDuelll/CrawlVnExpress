import puppeteer from "puppeteer";
import XLSX from "xlsx";
import { urls } from "./urls.js";

// Danh sách link sản phẩm (có thể có trùng)

// Loại trùng link
const urls1 = Array.from(new Set(urls));

async function getProductColors(page, url) {
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  await page.waitForSelector("main.min-h-screen", { timeout: 15000 });

  // Lấy tên sản phẩm
  const productName = await page.evaluate(() => {
    const el = document.querySelector("h1"); // tên sản phẩm thường nằm trong <h1>
    return el ? el.innerText.trim() : "Unknown Product";
  });

  // Lấy tất cả màu
  const colors = await page.evaluate(() => {
    const items = document.querySelectorAll("li.col-span-1 img");
    return Array.from(items)
      .map(img => img.getAttribute("alt"))
      .filter(Boolean)
  });

  return { productName, colors: colors.join(", ") }; // nối màu bằng dấu ,
}

async function scrapeAllProducts(urls1) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const allData = [];

  for (const url of urls1) {
    const productData = await getProductColors(page, url);
    allData.push(productData);
  }

  await browser.close();
  return allData;
}

async function exportColorsToExcel(urls1) {
  const allData = await scrapeAllProducts(urls1);

  // Chuẩn bị dữ liệu Excel
  const wsData = [
    ["Tên sản phẩm", "Các màu"] // header
  ];

  allData.forEach(item => {
    wsData.push([item.productName, item.colors]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Colors");
  XLSX.writeFile(wb, "Colors.xlsx");

  console.log("Xuất Excel thành công! Tổng số dòng:", allData.length);
}

exportColorsToExcel(urls);
