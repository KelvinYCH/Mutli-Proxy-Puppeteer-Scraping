const origin =
    "https://kktix.com/users/sign_in?back_to=https://kktix.com/events/sweetjohnhk0428/registrations/new";
const successTarget =
    "https://kktix.com/events/sweetjohnhk0428/registrations/new";
const proxyArray = require("./proxy.json");
require("events").EventEmitter.defaultMaxListeners = proxyArray.length + 3;

const { createInstance } = require("./utils/puppeteerUtil");

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

const isSuccess = async (page) => {
    try {
        await sleep(1000);
        await page.focus("#user_login");
        await page.keyboard.type("jecwltkp@liknz.com");
        await page.focus("#user_password");
        await page.keyboard.type("n!JE85b4e^2JAm");
        await page.keyboard.press("Enter");
    } catch (e) {}

    try {
        let err = await page.$$("#ERR_CONNECT_FAIL");
        if (err[0] != null) {
            return false;
        }
    } catch (e) {
        //console.log(e);
    }
    try {
        let url = page.url();
        if (url == successTarget) return true;
    } catch (e) {
        //console.log(e);
    }
    return false;
};

proxyArray.map(async (proxyEle) => {
    const { proxy, id, pw } = proxyEle;
    await createInstance(origin, proxy, id, pw, isSuccess);
});
