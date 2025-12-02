import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();


const API_URL = process.env.API_URL;


(async () => {
    console.log("Iniciando prueba de inserción con Puppeteer...");


    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();


    // Ir a la página de creación
    await page.goto("http://frontend:8080/create.html", {
        waitUntil: "networkidle0"
    });


    console.log("Llenando formulario...");


    await page.type("#title", "Libro Insertado por Puppeteer");
    await page.type("#author", "Agente Automatizado");
    await page.type("#year", "2025");


    await page.click("#btnSave");


    // Esperar a que la API procese
    await page.waitForTimeout(1500);


    console.log("✔️ Libro insertado (si la API respondió correctamente)");


    await browser.close();
})();