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
    await page.goto('https://github.com/mergutm/');

    // Espera un momento para que la página cargue completamente
    await sleep(1000);
    await page.screenshot({ path: '01-captura-repo.png', fullPage: true });
    // Escribe "ejemplo de puppeteer" en el campo de búsqueda.
    // El selector 'textarea[name="q"]' apunta a la barra de búsqueda principal de Google.
    // await page.type('#qb-input-query', 'puppeteer');

    // Presiona la tecla Enter para realizar la búsqueda.
    await page.keyboard.press('/');

    await page.screenshot({ path: '02-captura-evento.png', fullPage: true });

    // Espera a que la página cargue el formulario de búsqueda.
    await page.waitForSelector('#query-builder-test');
    // escribir en el campo de búsqueda con un retardo entre teclas 
    await page.type('#query-builder-test', 'puppeteer',  { delay: 300 });
    await page.screenshot({ path: '03-captura-busqueda.png', fullPage: true });

    //al finalizar la escritura, presiona Enter para ejecutar la busqueda
    await page.keyboard.press('Enter');



    // Espera 3 segundos para que puedas ver los resultados antes de cerrar
    await sleep(3000);
    await page.screenshot({ path: '04-captura-pagina_resultados.png', fullPage: true });

    await sleep(2000);

    console.log('Búsqueda completada. Cerrando navegador.');

    // Cierra el navegador.
    await browser.close();
})();