const puppeteer = require('puppeteer');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


(async () => {
    // Inicia el navegador Chromium.
    // headless: false abre una ventana visible del navegador.
    const browser = await puppeteer.launch({
        headless: false,
        //  puede ajustae el tamaño de la ventana del navegador 
        defaultViewport: { width: 1400, height: 1000 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']

    });

    const page = await browser.newPage();

    // Navega a la página principal de Google.
    await page.goto('https://www.google.com');

    // Espera un momento para que la página cargue completamente
    await sleep(1000);

    // Escribe "ejemplo de puppeteer" en el campo de búsqueda.
    // El selector 'textarea[name="q"]' apunta a la barra de búsqueda principal de Google.
    await page.type('textarea[name="q"]', 'ejemplo de puppeteer');

    await page.screenshot({ path: '01-captura-google.png', fullPage: true });

    // Presiona la tecla Enter para realizar la búsqueda.
    await page.keyboard.press('Enter');

    // Espera a que la página de resultados de la búsqueda cargue.
    await page.waitForSelector('#search');

    // Espera un par de segundos para que puedas ver los resultados antes de cerrar
    await sleep(5000);

    console.log('Búsqueda completada. Cerrando navegador.');

    // Cierra el navegador.
    await browser.close();
})();