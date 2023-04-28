import fs from 'fs';

export default class CartManager {

  constructor() {
    this.path = './files/Carts.json';

  }

  addCart = async ({ pid, qty }) => {
    try {
      //Traigo todos los carritoa
      const carts = await this.getCarts();
      //Asigno el id al carrito si no hay ninguno por defecto es 1 sino le sumo uno al id del ultimo agregado
      const cid = carts.length > 0 ? carts[carts.length - 1].cid + 1 : 1;
      //Creo el new cart
      const newCart = { cid, products: [{ pid, qty }] };
      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

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
    //Valido que el valor ingresado de carrito sea un numero
    if (isNaN(cid)) return res.status(400).send({ status: 'error', message: 'Please enter a valid id' });
    try {
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
      //Si no me envian un numero para el id del carrito retorno error
      if (isNaN(Number(cid))) return { status: "error", message: 'It is not a valid id' };
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


