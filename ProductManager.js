const fs = require('fs');

class ProductManager{
  constructor(filePath) {
    this.path = filePath;
    this.products = this.loadProducts();
    this.productIdCounter = this.calculateProductIdCounter();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error) {
      console.error('Error al cargar los productos:', error.message);
      return [];
    }
  }

  saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data, 'utf-8');
    } catch (error) {
      console.error('Error al guardar los productos:', error.message);
    }
  }

  calculateProductIdCounter() {
    return this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some(existingProduct => existingProduct.code === product.code)) {
      console.error("El código de producto ya existe.");
      return;
    }

    const newProduct = {
      id: this.productIdCounter++,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock,
    };

    this.products.push(newProduct);
    this.saveProducts();
    console.log("Producto agregado:", newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const foundProduct = this.products.find(product => product.id === productId);

    if (foundProduct) {
      return foundProduct;
    } else {
      console.error("Producto no encontrado. ID:", productId);
    }
  }

  updateProduct(productId, fieldToUpdate, updatedValue) {
    const productToUpdate = this.products.find(product => product.id === productId);

    if (productToUpdate) {
      productToUpdate[fieldToUpdate] = updatedValue;
      this.saveProducts();
      console.log("Producto actualizado:", productToUpdate);
    } else {
      console.error("Producto no encontrado. ID:", productId);
    }
  }

  deleteProduct(productId) {
    const indexToDelete = this.products.findIndex(product => product.id === productId);

    if (indexToDelete !== -1) {
      const deletedProduct = this.products.splice(indexToDelete, 1)[0];
      this.saveProducts();
      console.log("Producto eliminado:", deletedProduct);
    } else {
      console.error("Producto no encontrado. ID:", productId);
    }
  }
}

module.exports = ProductManager;