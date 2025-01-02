const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/scrape', async (req, res) => {
  const { bairro, cidade } = req.query;

  if (!bairro || !cidade) {
    return res.status(400).json({ error: 'Por favor, informe bairro e cidade nos parâmetros da consulta.' });
  }

  try {
    // Inicializa o Puppeteer
    const browser = await puppeteer.launch({ headless: false,
      //slowMo: 50,  
      defaultViewport: null 
     }); 
    const page = await browser.newPage();

    await page.goto('https://www.google.com.br/');
    await page.waitForSelector('textarea');
    await page.click('textarea');
    await page.type('textarea',`${bairro}, ${cidade} 2 quartos, 1 garagem, aluguel`);
    await page.keyboard.press('Enter');
    await page.waitForSelector('.hlcw0c')
    await page.click('.hlcw0c')
    // Acessa o site e realiza ações
    // await page.goto('https://www.zapimoveis.com.br/');
    // await page.waitForSelector('.l-input__input'); // Aguarda o seletor estar disponível
    // await page.click('.l-input__input');
    // await page.type('.l-input__input', `${bairro}, ${cidade}`); // Preenche o campo com o bairro e a cidade
    // await page.waitForSelector('.olx-core-checkbox-radio__root.olx-core-checkbox-radio__root--card.olx-core-checkbox__root.w-full'); // Wait for the selector to appear
    // const firstCheckbox = await page.$('.olx-core-checkbox-radio__root.olx-core-checkbox-radio__root--card.olx-core-checkbox__root.w-full');
    // if (firstCheckbox) {
    //   await firstCheckbox.click();
    // } else {
    //   console.error('No checkbox found with the specified class.');
    // }
    // await page.keyboard.press('Enter'); // Simula o pressionar da tecla "Enter"
    
    // await page.waitForSelector('.card-listing'); // Aguarda o carregamento dos resultados
    // const results = await page.evaluate(() => {
    //   const listings = document.querySelectorAll('.card-listing');
    //   return Array.from(listings).map(listing => {
    //     const title = listing.querySelector('.simple-card__title')?.innerText || 'Título indisponível';
    //     const price = listing.querySelector('.simple-card__price')?.innerText || 'Preço indisponível';
    //     const address = listing.querySelector('.simple-card__address')?.innerText || 'Endereço indisponível';
    //     return { title, price, address };
    //   });
    // });

    //await browser.close(); // Fecha o navegador

    res.json({ results }); // Retorna os resultados
  } catch (error) {
    console.error('Erro durante o scraping:', error);
    res.status(500).json({ error: 'Ocorreu um erro durante o scraping.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
