import puppeteer from "puppeteer";
import XLSX from "xlsx";

const url = "https://trangvangvietnam.com/categories/112370/may-mac-cac-cong-ty-may-mac.html/?page=2";

export const run = async () => {
    let datas = [];
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        //await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.goto(url, { waitUntil: "networkidle2" });    
        const data = await page.evaluate(() => {
            const elements = document.querySelectorAll("div.listings_center h2 a");
            const names = Array.from(elements).map(el => el.innerText.trim());
            const category = document.querySelector("h2.content-detail-sapo.sm-sapo-mb-0")?.innerText
                || "May Mặc - Các Công Ty May Mặc";
            //const addressElements = document.querySelectorAll("div.pt-0.pb-2.ps-3.pe-4 small");
            const addressElements = document.querySelectorAll("div.p-2.pt-0.ps-0.pe-4 small");
            const addresses = Array.from(addressElements).map(el => el.innerText.trim());
            //const sdtElements = document.querySelectorAll("div.pt-0.pb-2.ps-3.pe-4.listing_dienthoai a");
            const sdtElements = document.querySelectorAll("div.p-2.pt-0.ps-0.pe-4.pb-0 a");
            const sdts = Array.from(sdtElements).map(el => el.innerText.trim());

            return { names, category, addresses, sdts };
        });

        for (let i = 0; i < data.names.length; i++) {
            datas.push({
                Name: data.names[i],
                Category: data.category,
                Address: data.addresses[i] || "No address",
                Phone: data.sdts[i] || "No phone"
            });
        }

        await browser.close();
    } catch (error) {
        console.log(`Error fetching data from ${url}:`, error);
    }

    // Xuất ra Excel
    const ws = XLSX.utils.json_to_sheet(datas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers2");
    XLSX.writeFile(wb, "suppliers2.xlsx");

    console.log("✅ Exported to suppliers2.xlsx successfully!");
};

run();
