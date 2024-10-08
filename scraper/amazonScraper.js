// /scraper/amazonScraper.js

const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

// Function to scrape product data
const scrapeProductData = async (asin) => {
    let browser;
    try {
        const executablePath = await chromium.executablePath;
        browser = await puppeteer.launch({
            executablePath,
            headless: true, // Set to true for headless mode
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
        });

        const page = await browser.newPage();
        // Set a custom user-agent to mimic a real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

        const url = `https://www.amazon.com/dp/${asin}`;
        // Navigate to the product page
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Extract product data
        const productData = await page.evaluate(() => {
            const getElementText = (selector) => {
                const element = document.querySelector(selector);
                return element ? element.innerText.trim() : null;
            };

            const getElementValue = (selector) => {
                const element = document.querySelector(selector);
                return element ? element.value : null;
            };

            const asin = window.location.href.split('/dp/')[1]?.split('/')[0];
            const title = getElementText('#productTitle');
            const priceText = getElementText('.a-price .a-offscreen');
            const price = priceText ? parseFloat(priceText.replace(/[^0-9.-]+/g, '')) : null; // Remove "$" and convert to number
            const images = Array.from(document.querySelectorAll('#altImages img')).map(img => img.src);

            return {
                asin,
                adid: getElementValue('#adId'),
                sku: getElementValue('#sku'),
                merchantcustomerid: getElementValue('#merchantCustomerID'),
                merchantname: getElementText('#merchantName'),
                price,
                title,
                images,
            };
        });

        return productData; // Return the extracted product data
    } catch (error) {
        console.error('Error navigating to the page or scraping:', error);
        throw new Error('Failed to scrape product data');
    } finally {
        if (browser) {
            await browser.close(); // Close the browser after the task
        }
    }
};

module.exports = { scrapeProductData };
