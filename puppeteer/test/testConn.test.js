import puppeteer from "puppeteer-core";

console.log("Iniciando pruebas E2E con Puppeteer...");

const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
    ]
});

const page = await browser.newPage();
await page.goto("https://example.com");
console.log(await page.title());

await browser.close();
