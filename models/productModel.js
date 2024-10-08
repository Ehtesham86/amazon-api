// /models/productModel.js

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL; // Supabase URL from .env
const supabaseKey = process.env.SUPABASE_KEY; // Supabase Key from .env
const supabase = createClient(supabaseUrl, supabaseKey);

const ProductModel = {
    // Function to insert a product
    async insertProduct(productData) {
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select(); // Ensure returning data

        if (error) {
            throw new Error('Error inserting product: ' + error.message);
        }

        return data; // Return inserted product data
    },

    // Function to fetch all products
    async fetchAllProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*'); // Fetch all rows

        if (error) {
            throw new Error('Error fetching products: ' + error.message);
        }

        return data;
    }
};

module.exports = ProductModel;
