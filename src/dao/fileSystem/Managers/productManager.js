import fs from 'fs';
import __dirname from '../utils.js'

 class ProductManager {

    constructor() {
        this.path = `${__dirname}/files/Products.json`;
    }

    

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data); //Lo convierto a objeto
            return products;
        }
        return [];
    }

    addProducts = async ({ title, description, code, price, status, stock, category, thumbnails }) => {
        try {
          if (!title || !description || !code || !price || !status || !stock || !category) {
            return console.log('Error! one or more fields are incomplete');
          }
      
          const products = await this.getProducts();
          const product = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails, 
          }
          products.push(product);
          await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
          return product;
        } catch (error) {
          console.log(error); 
        }
      }

    getProductsById = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            //Busco el producto en el array
            const product = products.find(p => p.id === id);
            //Si no esta devuelvo null
            if (!product) {
                console.log(`The product with id ${id} does not exist`);
                return null;
            }
            //Si esta devuelvo el producto
            console.log(`The product with id ${id} is: `, product);
            return product;
        } catch (error) {
            console.log('Error reading file:', error);
        }
    }

    updateProduct = async (id, updatedProduct) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            const productIndex = products.findIndex(p => p.id === parseInt(id));
            //Si no encuentra el  id devuelvo el id no existe
            if (productIndex === -1) {
                throw new Error(`We cannot make an update to the product with id ${id} because it does not exist`);
            }
            //Si existe agrego el producto con los campos modificados pero devuelvo siempre el id original
            const productToUpdate = { ...products[productIndex], ...updatedProduct, id: parseInt(id) };
            products[productIndex] = productToUpdate;
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return productToUpdate;
        } catch (error) {
            return { error: error.message };
        }
    }

    deleteProduct = async (id) => {
        try {
            console.log(`Deleting product with id ${id}`);
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            //Busco el producto
            const productIndex = products.findIndex(p => parseInt(p.id) === parseInt(id));
            //Si no encuentro el producto devuelvo null
            if (productIndex === -1) {
                console.log(`We could not find a product that matches the id: ${id}`);
                return null;
            } else {
            //Si lo encuentro devuelvo el array de los productos menos el que solicito borrar
                const productNotEliminated = products.filter(p => parseInt(p.id) !== parseInt(id));
                await fs.promises.writeFile(this.path, JSON.stringify(productNotEliminated, null, '\t'));
                console.log(`The product with id ${id} has been eliminated`);
                return products[productIndex];
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default ProductManager;



/*const products= new ProductManager()

 const product = {
	
        "title": "Chopard Happy Diamonds",
        "description": "Contemporary, refined, assertive, the sporty-chi",
        "code": "WACH",
        "price": 6740,
        "status": true,
        "stock": 10,
        "category": "Watches",
        "thumbnails": "No image",

 }

  await products.addProducts(product);*/





