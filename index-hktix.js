const origin = "https://queue.hkticketing.com/hotshow.html";
const successTarget = "https://hotshow.hkticketing.com/";
const proxyArray = require("./proxy.json");
const maxInstance = 10;
require("events").EventEmitter.defaultMaxListeners = maxInstance + 3;

const { createInstance } = require("./utils/puppeteerUtil");

const isSuccess = async (page) => {
    try {
        let url = page.url();
        if (url.startsWith(successTarget)) return true;
    } catch (e) {
        console.log(e);
    }
    try {
        let loginBtn = await page.$$(".loginWrapper");
        if (loginBtn[0] != null) return true;
    } catch (e) {
        console.log(e);
    }
    return false;
};

const shuffled = proxyArray.sort(() => 0.5 - Math.random());

let selected = shuffled.slice(0, maxInstance);

let i = 0;

selected.map(async (proxyEle) => {
    let { proxy, id, pw } = proxyEle;
    if(i++ < (maxInstance / 2)) {
        id = "kelvinych918@gmail.com";
        pw = "Ylf010119!";
    } else {
        id = "kelvin918@proton.me";
        pw = "zFfLdH8PqJnPwq";
    }
    await createInstance(origin, proxy, id, pw, isSuccess);
});
