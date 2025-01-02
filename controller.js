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

    const currentUrl = page.url();

    if (currentUrl.includes('www.zapimoveis.com.br')) {
      // Aguarde a presença do seletor necessário na página
      await page.waitForSelector('[data-cy="rp-cardProperty-price-txt"]');
    
      // Extração de dados e construção da lista de objetos contendo todos os detalhes da propriedade
      const imovelList = await page.evaluate(() => {
        const listings = document.querySelectorAll('.ListingCard_result-card__Pumtx');
        const result = [];
      
        listings.forEach(listing => {
          const getQuantity = (ariaLabel) => {
            const spanElement = listing.querySelector(`span[aria-label="${ariaLabel}"]`);
            if (!spanElement) return null;
      
            const parentElement = spanElement.closest('p');
            if (parentElement) {
              const textContent = parentElement.textContent.trim();
              const number = parseInt(textContent.replace(/\D/g, ''), 10);
              return isNaN(number) || number < 0 ? null : number;
            }
            return null;
          };
      
          // Função para extrair preços
          const extractPrices = (priceText) => {
            if (!priceText) return { aluguel: null, condominio: null, iptu: null };
      
            const priceDetails = { aluguel: null, condominio: null, iptu: null };
      
            // Expressão regular para identificar os valores de preço
            const priceRegex = /R\$\s([\d\.]+)(?:\/mês)?/g;
            const condoRegex = /Cond\.\sR\$\s([\d\.]+)/;
            const iptuRegex = /IPTU\sR\$\s([\d\.]+)/;
      
            const aluguelMatch = priceRegex.exec(priceText);
            if (aluguelMatch) {
              priceDetails.aluguel = parseFloat(aluguelMatch[1].replace('.', '').replace(',', '.'));
            }
      
            const condominioMatch = condoRegex.exec(priceText);
            if (condominioMatch) {
              priceDetails.condominio = parseFloat(condominioMatch[1].replace('.', '').replace(',', '.'));
            }
      
            const iptuMatch = iptuRegex.exec(priceText);
            if (iptuMatch) {
              priceDetails.iptu = parseFloat(iptuMatch[1].replace('.', '').replace(',', '.'));
            }
      
            return priceDetails;
          };
      
          // Extração de preços do texto
          const priceText = listing.querySelector('[data-cy="rp-cardProperty-price-txt"]') ? 
                            listing.querySelector('[data-cy="rp-cardProperty-price-txt"]').textContent.trim() : null;
      
          const prices = extractPrices(priceText);
      
          // Construção do objeto contendo tanto os detalhes da propriedade quanto as informações de preço
          result.push({
            squared_meters: getQuantity('Tamanho do imóvel'),
            bathrooms: getQuantity('Quantidade de banheiros'),
            bedrooms: getQuantity('Quantidade de quartos'),
            garages: getQuantity('Quantidade de vagas de garagem'),
            price_details: prices
          });
        });
      
        return result; // Retorna a lista de detalhes da propriedade com preços
      });
      
      
    
      console.log(imovelList); // Exibe a lista extraída de detalhes da propriedade com preços
    } else {
      console.log('Site acessado não é o Zap Imóveis');
    }
    
    
    
    
 

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
