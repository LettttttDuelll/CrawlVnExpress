import puppeteer from "puppeteer";

const url = "https://vnexpress.net";

export const run = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("article.item-news");
    const links = await page.$$eval("article.item-news", els => els.map(el => {
        const linkEl = el.querySelector("h3.title-news a")?.href;
        return linkEl || 'No link found';
    }));
    for (let i = 0; i < links.length; i++) {
        for (let j = i + 1; j < links.length; j++) {
            if (links[i] === links[j]) {
                links.splice(j, 1);
                j--;
            }
        }
    }

    links.forEach(element => {
        console.log(element);
    });

    let datas = [];
    for (const link of links) {
        try {
            const browser1 = await puppeteer.launch({ headless: false });
            const page1 = await browser1.newPage();
            await page1.goto(link, { waitUntil: "domcontentloaded" });
            await page1.waitForSelector("h1.title-detail");
            const data = await page1.evaluate(() => {
                const title = document.querySelector("h1.title-detail")?.innerText || "No title found";
                const description = document.querySelector("p.description")?.innerText || "No description found";
                const category = document.querySelector("ul.breadcrumb li a")?.innerText || "No category found";
                //const tags = Array.from(document.querySelectorAll("div.tags h4.item-tag a")).map(el => el.innerText.trim())|| [];
                const tags = document.querySelector("a.link-topic-detail h2")?.innerText.trim()|| "No tags found";
                const content = document.querySelector("article.fck_detail")?.innerText || "No content found";
                const img = document.querySelector("article.fck_detail img")?.src || "No image found";
                const imgName = img.split('/').pop() || "No image name found";
                const author = document.querySelector("p.Normal strong")?.innerText || "No author found";
                const date = document.querySelector("span.date")?.innerText || "No date found";
                return { title: title, description: description, img: img, imgName: imgName, author: author, category: category, tags: tags, content: content, date: date};
            });
            datas.push(data);
            await browser1.close();
        } catch (error) {
            console.log(`Error fetching data from ${link}:`, error);
            continue; // Skip to the next link
        }
    }
    await browser.close();
    datas.forEach(element => {
        console.log(element.author);
        //date ok
        //title ok
        //content ok
        //tags maybe ok:)))))
    });
    return datas;
};
run();