const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const port = 8000; 

const productManager = new ProductManager('products.json');

// Endpoint para obtener todos los productos con un límite
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
        const products = productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);

    if (product) {
            res.json(product);
    } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error retrieving product by ID:', error);

    if (error.message === 'Product not found') {
        res.status(404).json({ error: 'Product not found' });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
    });

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
