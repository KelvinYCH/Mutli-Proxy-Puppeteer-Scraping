// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");
const fs = require("fs");
const path = require("path");

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(require("puppeteer-extra-plugin-stealth")());
puppeteer.use(require("puppeteer-extra-plugin-minmax")());
//puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

const isHalt = () => {
    let haltFile = path.join(__dirname, "..", "stop");
    return fs.existsSync(haltFile) ? true : false;
};

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

const createInstance = async (target, proxy, id, pw, isSuccess) => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            "--disable-dev-shm-usage",
            "--no-sandbox",
            "--disable-site-isolation-trials",
            "--proxy-server=" + proxy,
        ],
    });
    const page = await browser.newPage();
    await page.minimize();
    while (!(await isSuccess(page))) {
        if (isHalt()) {
            console.log("Temperary Stopped.");
            await sleep(3000);
            continue;
        }
        try {
            await page.setCacheEnabled(false);
            await page.authenticate({
                username: id,
                password: pw,
            });
            page.setDefaultNavigationTimeout(10000);
        } catch (e) {
            console.log("failed in auth");
        }
        try {
            let res = await page.goto(target, { waitUntil: "networkidle2" });
        } catch (e) {
            //console.log(e);
            //console.error(`Error browsing page, retrying!`);
        }
        console.log(`Navigated to url : ${page.url()}`);
        await sleep(3000);
        //break;
    }

    await page.maximize();
    console.log("Success!!");
};

module.exports.createInstance = createInstance;
