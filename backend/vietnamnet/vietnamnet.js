import puppeteer from "puppeteer";

const url = "https://vietnamnet.vn/";

export const run = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    let links = await page.$$eval("a", els =>
        els
            .map(el => el.href)
            .filter(href => href.includes("vietnamnet.vn") && href.endsWith(".html"))
    );

    // Loại bỏ trùng lặp
    links = [...new Set(links)];
    console.log(`Found ${links.length} unique links.`);

    links.forEach(element => {
        console.log(element);
    });

    let datas = [];
    for (const link of links) {
        try {
            const browser1 = await puppeteer.launch({ headless: true });
            const page1 = await browser1.newPage();

            await page1.goto(link, { waitUntil: "domcontentloaded" });
            await page1.waitForSelector("h1.content-detail-title");

            const data = await page1.evaluate(() => {
                const title = document.querySelector("h1.content-detail-title")?.innerText || "No title found";
                const description = document.querySelector("h2.content-detail-sapo.sm-sapo-mb-0")?.innerText
                    || "No description found";
                const links = document.querySelectorAll("div.bread-crumb-detail.sm-show-time ul li a");
                console.log(links[1].innerHTML.trim());
                const category = links[1]?.innerText.trim() || "No category found";
                //const category = document.querySelector("div.bread-crumb-detail.sm-show-time ul li a")?.innerText || "No category found";
                const tags = [...document.querySelectorAll("div.tag-cotnent ul li h3 a")]
                    .map(tag => tag.innerText.trim())
                    .filter(Boolean);
                //const content = document.querySelector("article.fck_detail")?.innerText || "No content found";
                const elements = document.querySelectorAll("div.maincontent.main-content p");
                //const elements = document.querySelectorAll("div.maincontent.main-content p");
                const content = elements.length > 0
                    ? Array.from(elements).map(el => el.innerText).join(" ")
                    : "No content found";
                //const img = document.querySelector("picture img.lazy-loaded")?.src || "No image found";
                const img = document.querySelector("img.lazy-loaded")?.getAttribute("data-original")
                    || "No image found";
                const imgName = img.split('/').pop() || "No image name found";
                const strongs = document.querySelectorAll("p.Normal strong");
                //const author = strongs.length > 0 ? strongs[strongs.length - 1].innerText: "No author found";
                const author = document.querySelector("p.article-detail-author__info span.name a")?.innerText || "No author found";
                const date = document.querySelector("div.bread-crumb-detail__time")?.innerText || "No date found";
                return { title: title, description: description, img: img, imgName: imgName, author: author, category: category, tags: tags, content: content, date: date };
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
        //console.log(element.title);//ok
        //console.log(element.description);//ok
        //console.log(element.category);//ok
        //console.log(element.tags);//ok
        //console.log(element.author);//ok
        //console.log(element.content);//ok
        //console.log(element.date);//ok
        //console.log(element.img);//ok
        console.log('-----------------------------------');
    });
    return datas;
};
run();