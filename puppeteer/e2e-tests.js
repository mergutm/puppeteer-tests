// e2e-tests.js
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const REPORT_DIR = "./reports";
if (!fs.existsSync(REPORT_DIR))
    fs.mkdirSync(REPORT_DIR);
else
    console.log("Carpeta de reportes creada");

async function startBrowser() {
    console.log("Iniciando pruebas E2E con Puppeteer...");

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
    //const FRONTEND_URL =  "http://localhost:8080";

    let report = "";
    const addToReport = (msg) => {
        console.log(msg);
        report += msg + "\n";
    };

    try {
        // Cargar página principal
        addToReport("01-Cargando interfaz ... (ok)");
        
        await page.goto(`${FRONTEND_URL}/index.html`, { waitUntil: "networkidle0" });
        await wait(1050);
        await capture(page, "01_index_cargado");

        // Esperar a que la tabla esté lista
        await page.waitForSelector("#books-table");

        // Insertar un libro
        addToReport("02-Insertando un nuevo libro... (ok)");

        await page.goto(`${FRONTEND_URL}/insert.html`, { waitUntil: "networkidle0" });

        await page.type("#title", "Libro PPTR");
        await page.type("#author", "QA Bot");
        await page.type("#year", "2025");

        await capture(page, "02_datos_cargados_a_insertar");
        await page.click("button");        
        await wait(500); // usando función wait()

        await page.waitForSelector("#books-table-body");
        addToReport("03-Captura antes de verificar inserción " + `${FRONTEND_URL}/index.html`);
        await capture(page, "03_index_despues_de_insertar");
        
        // Finalizar reporte
        fs.writeFileSync(`${REPORT_DIR}/report.txt`, report);
        addToReport("04-Reporte generado en /reports/report.txt");

    } catch (err) {
        console.error("ERROR EN PRUEBAS:", err);
        fs.writeFileSync(`${REPORT_DIR}/error.txt`, err.toString());
    } finally {
        await browser.close();
    }
}

runTests();


/*
    docker compose -f 'docker-compose.yml' up -d --build 'mongodb' 
    docker compose -f 'docker-compose.yml' up -d --build 'api' 
    docker compose -f 'docker-compose.yml' up -d --build 'frontend' 

docker compose -f 'docker-compose.yml' up -d --build 'puppeteer' 
docker logs puppeteer-tests
docker exec -it puppeteer-tests sh 
*/