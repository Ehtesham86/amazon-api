// /controllers/productController.js

const ProductModel = require('../models/productModel');
const { scrapeProductData } = require('../scraper/amazonScraper');

// Handle scraping and inserting product
const scrapeAndInsertProduct = async (req, res) => {
    try {
        const asin = req.body.asin; // Expect ASIN from request body
        const productData = await scrapeProductData(asin); // Scrape product details

        const insertedData = await ProductModel.insertProduct(productData); // Insert data into Supabase
        res.status(201).json({ message: 'Product inserted successfully', data: insertedData });
        console.log('product added successfylly:',insertedData)
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
};

// Handle fetching all products
const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.fetchAllProducts(); // Fetch all products from Supabase
        res.status(200).json({ message: 'Products fetched successfully', data: products });
        console.log('Products fetched successfully:',products)
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)

    }
};

module.exports = {
    scrapeAndInsertProduct,
    getAllProducts,
};
