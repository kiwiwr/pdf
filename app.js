const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/generate-pdf', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(url, {
      waitUntil: 'networkidle2'
    });

    const pdfBuffer = await page.pdf({
      printBackground: true,
      format: 'A4',
      preferCSSPageSize: true,
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
        timeout: '900000'
      }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');

    //res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
    
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    res.status(500).send('Error generating PDF' + error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});