import puppeteer from "puppeteer";

//const url = "https://dantri.com.vn/";

export const run = async (url) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("article.article-item");
    const links = await page.$$eval("article.article-item", els => els.map(el => {
        const linkEl = el.querySelector("h3.article-title a")?.href;
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
            const browser1 = await puppeteer.launch({ headless: true });
            const page1 = await browser1.newPage();
            await page1.evaluate(() => window.scrollBy(0, 500));

            await page1.goto(link, { waitUntil: "domcontentloaded"});

            const data = await page1.evaluate(() => {
                const title = document.querySelector("h1.title-page.detail")?.innerText || "No title found";
                const description = document.querySelector("h2.singular-sapo")?.innerHTML || "No description found";
                const category = document.querySelector("div.dt-mb-6 ul li a")?.innerText || "No category found";
                const tags = [...document.querySelectorAll("ul.tags-wrap.mt-30 li a")]
                    .map(tag => tag.innerText.trim())
                    .filter(Boolean);
                const paragraphs = document.querySelectorAll("div.singular-content p");

                const content = paragraphs.length > 0
                    ? Array.from(paragraphs).map(p => p.innerText).join(" ")
                    : "No content found";
                const img = document.querySelector("figure.image.align-center img.entered.loaded")?.src || "No image found";
                const imgName = document.querySelector("figcaption p")?.innerText || "No image name found";
                const strongs = document.querySelectorAll("p.Normal strong");
                const author = document.querySelector("div.author-name a b")
                    ?.innerText
                    || "No author found";
                const date = document.querySelector("time.author-time")?.innerText || "No date found";
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
        //console.log(element.tags);//ok
        //console.log(element.category);//ok
        //console.log(element.content);//ok

        //console.log(element.img);//notok
        //console.log(element.imgName);//ok
        //console.log(element.author);//ok
        //console.log(element.date);//ok
        //console.log('-------------------');
    });
    return datas;

};
//run();