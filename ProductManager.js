const fs = require('fs');

class ProductManager {
  constructor(dataFilePath) {
    this.dataFilePath = dataFilePath;
    this.products = [];
    this.loadProductsFromFile();
    this.idCounter = this.products.length > 0 ? Math.max(...this.products.map(p => parseInt(p.id, 10))) + 1 : 1;
  }

  getProducts() {
    return this.products;
  }

  addProduct(title, description, price, thumbnail, code, stock, callback) {
    const id = this.generateUniqueId();
    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(product);

    this.saveProductsToFile((err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, product);
      }
    });
  }

  getProductById(id, callback) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      callback(new Error("Product not found"));
    } else {
      callback(null, product);
    }
  }

  updateProduct(id, updatedFields, callback) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      callback(new Error("Product not found"));
      return;
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedFields,
      id,
    };

    this.saveProductsToFile((err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, this.products[productIndex]);
      }
    });
  }

  deleteProduct(id, callback) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      callback(new Error("Product not found"));
      return;
    }

    const deletedProduct = this.products.splice(productIndex, 1)[0];

    this.saveProductsToFile((err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, deletedProduct);
      }
    });
  }

//Generador de IDs
  generateUniqueId() {
    const id = this.idCounter.toString();
    this.idCounter += 1;
    return id;
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.dataFilePath, 'utf-8');
      this.products = JSON.parse(data);
    } catch (err) {
    }
  }

  saveProductsToFile(callback) {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFile(this.dataFilePath, data, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  }
}

// Ejemplo de uso:
const dataFilePath = 'products.json';
const productManager = new ProductManager(dataFilePath);

console.log(productManager.getProducts()); // []

productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25,
  (err, newProduct) => {
    if (err) {
      console.error(err);
    } else {
      console.log(productManager.getProducts());

      productManager.getProductById(newProduct.id, (err, retrievedProduct) => {
        if (err) {
          console.error(err);
        } else {
          console.log(retrievedProduct);

          productManager.updateProduct(
            newProduct.id,
            { price: 250 },
            (err, updatedProduct) => {
              if (err) {
                console.error(err);
              } else {
                console.log(updatedProduct);

                productManager.deleteProduct(
                  newProduct.id,
                  (err, deletedProduct) => {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log(deletedProduct);
                      console.log(productManager.getProducts());
                    }
                  }
                );
              }
            }
          );
        }
      });
    }
  }
);
