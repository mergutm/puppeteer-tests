// e2e-tests.js
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const REPORT_DIR = "./reports";
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR);

async function startBrowser() {
    console.log("🚀 Iniciando pruebas E2E con Puppeteer...");

    return await puppeteer.launch({
        executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--window-size=1280,800"
        ]
    });
}

async function capture(page, name) {
    await page.screenshot({ path: `${REPORT_DIR}/${name}.png` });
}

async function runTests() {
    const browser = await startBrowser();
    const page = await browser.newPage();

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://frontend:8080";

    let report = "";
    const addToReport = (msg) => {
        console.log(msg);
        report += msg + "\n";
    };

    try {
        // -----------------------------------------------------
        // 1. Cargar página principal
        // -----------------------------------------------------
        addToReport("📄 Cargando interfaz...");
        await page.goto(FRONTEND_URL, { waitUntil: "networkidle0" });
        await capture(page, "01_home_loaded");

        // Esperar a que la tabla esté lista
        await page.waitForSelector("#books-table");

        // -----------------------------------------------------
        // 2. Insertar un libro
        // -----------------------------------------------------
        addToReport("➕ Insertando un nuevo libro...");

        await page.goto(`${FRONTEND_URL}/create.html`, { waitUntil: "networkidle0" });

        await page.type("#title", "Puppeteer Testing Book");
        await page.type("#author", "QA Bot");
        await page.type("#year", "2025");

        await capture(page, "02_before_create");

        await page.click("#btnSave");
        await wait(1500); // usando nuestra función wait()

        await page.goto(FRONTEND_URL, { waitUntil: "networkidle0" });
        await page.waitForSelector("#books-table");
        await capture(page, "03_after_create");

        const exists = await page.evaluate(() =>
            [...document.querySelectorAll("td")].some(td => td.textContent.includes("Puppeteer Testing Book"))
        );

        if (!exists) throw new Error("❌ El libro no se insertó correctamente");
        addToReport("✔ Libro insertado correctamente");

        // -----------------------------------------------------
        // 3. Actualizar ese libro
        // -----------------------------------------------------
        addToReport("✏️ Actualizando el libro...");
        await page.click(`a[data-title="Puppeteer Testing Book"][data-action="edit"]`);

        await page.waitForSelector("#title");
        await page.evaluate(() => { document.querySelector("#title").value = ""; });
        await page.type("#title", "Puppeteer Testing Book - Updated");

        await capture(page, "04_before_update");

        await page.click("#btnUpdate");
        await wait(1500);

        await page.goto(FRONTEND_URL, { waitUntil: "networkidle0" });
        await capture(page, "05_after_update");

        const updatedExists = await page.evaluate(() =>
            [...document.querySelectorAll("td")].some(td => td.textContent.includes("Updated"))
        );

        if (!updatedExists) throw new Error("❌ El libro no se actualizó");
        addToReport("✔ Libro actualizado correctamente");

        // -----------------------------------------------------
        // 4. Eliminar el libro
        // -----------------------------------------------------
        addToReport("🗑 Eliminando el libro...");
        await page.click(`a[data-title="Puppeteer Testing Book - Updated"][data-action="delete"]`);

        await wait(1500);
        await page.goto(FRONTEND_URL, { waitUntil: "networkidle0" });
        await capture(page, "06_after_delete");

        const deleted = await page.evaluate(() =>
            ![...document.querySelectorAll("td")].some(td => td.textContent.includes("Updated"))
        );

        if (!deleted) throw new Error("❌ El libro no fue eliminado");
        addToReport("✔ Libro eliminado correctamente");

        // -----------------------------------------------------
        // 5. Finalizar reporte
        // -----------------------------------------------------
        fs.writeFileSync(`${REPORT_DIR}/report.txt`, report);
        addToReport("📘 Reporte generado en /reports/report.txt");

    } catch (err) {
        console.error("❌ ERROR EN PRUEBAS:", err);
        fs.writeFileSync(`${REPORT_DIR}/error.txt`, err.toString());
    } finally {
        await browser.close();
    }
}

runTests();
