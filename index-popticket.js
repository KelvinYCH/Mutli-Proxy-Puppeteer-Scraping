const origin = "https://popticket.queue-it.net/?c=popticket&e=1047such30jan&cid=zh-HK";
const successTarget = "https://popticket.queue-it.net/?c=popticket&e=1047such30jan&cid=zh-HK";
const proxyArray = require("./proxy-cityline.json");
require("events").EventEmitter.defaultMaxListeners = proxyArray.length + 3;

const { createInstance } = require("./utils/puppeteerUtil");

const isSuccess = async (page) => {
    try {
        let err = await page.$$("#ERR_CONNECT_FAIL");
        if (err[0] != null) {
            return false;
        }
    } catch (e) {
        console.log(e);
    }
    try {
        let url = page.url();
        if (url.indexOf(successTarget) >= 0) return true;
    } catch (e) {
        console.log(e);
    }
    try {
        let loginBtn = await page.$$(".mem-login-state-link");
        if (loginBtn[0] != null) return true;
    } catch (e) {
        console.log(e);
    }
    return false;
};

proxyArray.map(async (proxyEle) => {
    const { proxy, id, pw } = proxyEle;
    await createInstance(origin, proxy, id, pw, isSuccess);
});
