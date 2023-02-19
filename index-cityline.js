const origin = "https://venue.cityline.com/utsvInternet/CITIPBEC/login";
const successTarget1 = "www.cityline.com";
const successTarget2 = "event.cityline.com";
const proxyArray = require("./proxy.json");
require("events").EventEmitter.defaultMaxListeners = proxyArray.length + 3;

const { createInstance } = require("./utils/puppeteerUtil");

const isSuccess = async (page) => {
    try {
        let err = await page.$$("#ERR_CONNECT_FAIL");
        if (err[0] != null) {
            return false;
        }
    } catch (e) {
        return false;
    }
    try {
        if (page.url().indexOf(successTarget1) > 0) return true;
        if (page.url().indexOf(successTarget2) > 0) return true;
        let banner = await page.$$(".bannerContent");
        if (banner[0] != null) {
            return true;
        }
    } catch (e) {
        console.log(e);
    }

    return false;
};

proxyArray.map(async (proxyEle) => {
    const { proxy, id, pw } = proxyEle;
    await createInstance(origin, proxy, id, pw, isSuccess);
});
