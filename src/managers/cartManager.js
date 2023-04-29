import fs from 'fs';
import __dirname from '../utils.js'

export default class CartManager {

  constructor() {
    this.path = `${__dirname}/files/Products.json`;

  }
  addCart = async (products) => {
    try {
      const carts = await this.getCarts();
      //Genero el id del cart
      const newCid = carts.length > 0 ? carts[carts.length - 1].cid + 1 : 1;
      //creo el objeto donde voy a guardar el nuevo cart
      const newCart = { cid: newCid, products: [] };
      //Chequeo que los valores ingresados sean  numeros
      products.forEach((product) => {
        if (isNaN(product.pid) || isNaN(product.qty)) {
          throw new Error("Enter a valid value");
        }
        //Chequeo si alguno de los campos esta vacio
        if (!product.pid || !product.qty) {
          throw new Error("One or more fields are incomplete");
        }
        newCart.products.push(product);
      });
      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      return newCart;
    } catch (error) {
      console.log(error);
    }
  };
  

  getCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        //Traigo todos los carts que hay
        const dataCart = await fs.promises.readFile(this.path, 'utf-8');
        const carts = JSON.parse(dataCart); //Lo convierto a objeto
        return carts;
      }
      //Sino retorno un array vacio
      return [];
    } catch (error) {
      return { status: "error", message: "Something went wrong" }
    }
  };

  getCartsById = async (cid) => {
    try {
       //Valido que el valor ingresado de carrito sea un numero
    if (isNaN(cid)) return res.status(400).send({ status: 'error', message: 'Please enter a valid id' });
   
      const data = await fs.promises.readFile(this.path, 'utf-8');
      const carts = JSON.parse(data);
      //Busco en los carts por por id
      const cart = carts.find(c => c.cid === cid);
      //Si no lo ecuentro deuvelvo mensaje
      if (!cart) {
        console.log(`The Cart with id ${cid} does not exist`);
        return null;
      }
      //Si lo encuentro retorno el cart solicitado
      console.log(`The Cart with id ${cid} is: `, cart);
      return cart;
    } catch (error) {
      console.log('Error reading file:', error);
      return null;
    }
  }

  updateCart = async (cid, updatedCart) => {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      const carts = JSON.parse(data);
      //Busco por index el cart de acuerdo al cid enviado
      const cartIndex = carts.findIndex(c => c.cid === parseInt(cid));
      //Si no lo encuentro arrojo error
      if (cartIndex === -1) {
        throw new Error(`We cannot make an update to the cart with id ${cid} because it does not exist`);
      }
      //Si lo encuentro hago update del carrito
      const cartToUpdate = { ...Number(carts[cartIndex]), ...updatedCart };
      carts[cartIndex] = cartToUpdate;
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
    } catch (err) {
      console.log(err);
    }

  }

}


/*const carts = new CartManager()

const cart = {
   products: [
     {
       pid: 1,
       qty: 2
     },
     {
       pid: 8,
       qty: 3
     }
   ]
 };
 await carts.addCart(cart);*/


