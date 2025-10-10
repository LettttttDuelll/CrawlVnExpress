import puppeteer from "puppeteer";

const url = "https://baonghean.vn/";

export const run = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    let links = await page.$$eval("a", els =>
        els
            .map(el => el.href)
            .filter(href => href.includes("baonghean.vn") && href.endsWith(".html"))
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

            const data = await page1.evaluate(() => {
                const title = document.querySelector("h1.sc-longform-header-title.block-sc-title")?.innerText || "No title found";
                const description = document.querySelector("p.sc-longform-header-sapo.block-sc-sapo")?.innerText
                    || "No description found";
                const links = document.querySelectorAll("ol li.breadcrumb-item a");
                const category = links[1]?.innerText.trim() || "No category found";
                const tags = [...document.querySelectorAll("div.c-widget-tags.onecms__tags ul li h4 a")]
                    .map(tag => tag.innerText.trim())
                    .filter(Boolean);
                const author = document.querySelector("div.sc-longform-header-meta span.sc-longform-header-author.block-sc-author")?.innerText || "No author found";
                const date = document.querySelector("span.sc-longform-header-date.block-sc-publish-time")?.innerText || "No date found";
                const elements = document.querySelectorAll("p.align-justify");
                const content = elements.length > 0
                    ? Array.from(elements).map(el => el.innerText).join(" ")
                    : "No content found";
                const imgs = document.querySelectorAll("article.entry.entry-no-padding figure img")
                //const img = imgs.length > 0 ? Array.from(imgs).map(el => el.src) : "No image found";
                const img = imgs.length > 0 ? imgs[0].src : "No image found";
                const imgName = imgs.length > 0 ? Array.from(imgs).map(el => el.alt) : "No image name found";
                return { title: title, description: description, category: category, tags: tags, author: author, date: date, content: content, img: img , imgName: imgName};
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
        //console.log(element.imgName);//ok
        console.log('-----------------------------------');
    });
    return datas;
};
//run();