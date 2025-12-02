import puppeteer from "puppeteer";
import dotenv from "dotenv";
import fs from "fs-extra";
dotenv.config();


const API = process.env.API_URL;
const FRONTEND = process.env.FRONTEND_URL;


// carpeta para reportes
await fs.ensureDir("test/reports");


const screenshot = async (page, filename) => {
    await page.screenshot({ path: `test/reports/${filename}` });
};


console.log("Iniciando pruebas E2E con Puppeteer...");


(async () => {
    console.log("Iniciando pruebas E2E con Puppeteer...");
    //const browser = await puppeteer.launch({ headless: true });
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


    const report = [];


    const log = (msg) => {
        console.log(msg);
        report.push(msg);
    };


    try {
        log("➡️ TEST 1: Insertar libro");
        await page.goto(`${FRONTEND}/create.html`, { waitUntil: "networkidle0" });


        await page.type("#title", "Libro Puppeteer");
        await page.type("#author", "Tester");
        await page.type("#year", "2025");
        await screenshot(page, "1_form_filled.png");


        await page.click("#btnSave");
        //await page.waitForTimeout(1000);
        const wait = ms => new Promise(r => setTimeout(r, ms));
        await wait(1000);



        log("✔️ Libro insertado");


        // Validación en la tabla
        log("➡️ TEST 2: Validar en la tabla");
        await page.goto(`${FRONTEND}/index.html`, { waitUntil: "networkidle0" });
        await screenshot(page, "2_table_loaded.png");


        const exists = await page.evaluate(() => {
            return [...document.querySelectorAll("table tbody tr td:first-child")]
                .some(td => td.innerText.includes("Libro Puppeteer"));
        });


        if (!exists) throw new Error("❌ El libro no aparece en la tabla");
        log("✔️ Libro confirmado en la tabla");


        // Obtener ID desde la API
        const books = await (await fetch(`${API}/books`)).json();
        const book = books.find(b => b.title === "Libro Puppeteer");


        if (!book) throw new Error("❌ Libro no encontrado por API");


        const id = book._id;


        // Actualizar
        log("➡️ TEST 3: Actualizar libro");
        await page.goto(`${FRONTEND}/update.html?id=${id}&title=Libro Puppeteer&author=Tester&year=2025`);
        await page.waitForSelector("#title");
        await screenshot(page, "3_update_form_loaded.png");


        await page.click("#title", { clickCount: 3 });
        await page.type("#title", "Libro Puppeteer Actualizado");


        await page.click("#btnUpdate");
        await page.waitForTimeout(1000);
        log("✔️ Libro actualizado");


        // Eliminar
        log("➡️ TEST 4: Eliminar libro");
        await page.goto(`${FRONTEND}/index.html`, { waitUntil: "networkidle0" });
        await screenshot(page, "4_before_delete.png");


        await page.evaluate((title) => {
            const rows = [...document.querySelectorAll("tbody tr")];
            const row = rows.find(r => r.innerText.includes(title));
            row.querySelector(".btn-delete").click();
        }, "Libro Puppeteer Actualizado");


        await page.waitForTimeout(1500);
        await screenshot(page, "5_after_delete.png");


        log("✔️ Libro eliminado");


    } catch (err) {
        log(`❌ ERROR: ${err.message}`);
    }


    // Guardar reporte
    await fs.writeFile("test/reports/report.txt", report.join(""));


    await browser.close();
})();
