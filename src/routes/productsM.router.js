import { Router } from "express";
import { productsM } from '../dao/mongo/managers/index.js'
import { passportCall } from '../services/auth.js';
import BaseRouter from "./Router.js";
import mongoose from "mongoose"


export default class ProductsRouter extends BaseRouter {

  init() {
/*router.get('/', async (req, res) => {
const { limit, page, sort, category } = req.query;

   // const result  = await productModel.paginate({},{limit:10,lean:true})
   //console.log(result)
   // res.status(200).send({ status: 'success', payload: result});    
try{

        const products = await productsM.getProducts();
        if (!limit) {
            const withoutlimit = products.slice(0, 10);
        res.status(200).send({ status: 'success', payload: withoutlimit });
           // res.send({ status: 'success', payload: products });
        } else {
        // Si el limit que me envían es menor a 0 o una letra, me manda un error
        if (limit < 0 || isNaN(limit)) {
            return res.status(400).send({ status: 'error', message: 'Please enter a valid value' });
        }
        // Si me envían un limit, hago un slice del array por el límite enviado y traigo solo esos productos
        const limitedProducts = products.slice(0, limit);
        res.status(200).send({ status: 'success', payload: limitedProducts });
        
            }      
    }catch(error) {
        console.log(error);
    }

});*/

//Crea el producto
this.post('/',['ADMIN'], passportCall('jwt', {strategyType: 'jwt'}), async(req,res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        //Si no me envian alguno de estos campos a excepcion de thumbnails(que no es obligatorio) arrojo error
        if (!title || !description || !code || !price || !status || !stock || !category) {
            return res.sendBadRequest ("One or more fields are incomplete" );
        }
        const product = {
            title,
            description,
            code,
            price,
            status:"Active", 
            stock,
            category,
            thumbnail: thumbnails !== undefined ? thumbnails : 'No image'
        }
        console.log('este es del post',product)
        //Agrego el producto con la informacion enviada
        const addedProduct = await productsM.createProduct(product);
        //Vuelvo a traer a mis productos
        const resultProducts = await productsM.getProducts();
        req.io.emit('resultProducts', resultProducts)
        //Si queda undefined o null tira error de agregar
        if (!addedProduct) return res.status(404).send({ status: 'error', message: 'Product not added' });
        //Devuelo el producto agregado
        return res.send({status:'succes', payload:addedProduct})
    } catch (error) {
        console.log(error);
    }
})

//Busca el producto
this.get('/:pid',['PUBLIC'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
    const { pid } = req.params;
    const pidNumber = parseInt(pid);
    try {
      // Check if pid is a valid positive number
        if (pidNumber < 0 || isNaN(pidNumber)) {
        return res.sendBadRequest ('Please enter a valid id');
        }
    
        const product = await productsM.getProductBy({_id: pid});
      // If the product is not found, send an error response
        if (!product) {
        return res.status(404).send({ status: 'error', message: 'Product not found' });
        }   
      // If the product is found, send the product information
        res.send({ status: 'success', payload: product });
    } catch (error) {
        console.log(error);
        res.sendInternalError('Internal server error' );
    }
});

//Actualiza el producto
this.put('/:pid',['ADMIN'], passportCall('jwt', {strategyType: 'jwt'}), async(req,res) => {
    const { pid } = req.params;
    const productUpdate = req.body;
    try {
        //Si no envian parametro de pid
        if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.sendBadRequest ('Please enter a product ID' );
        }
       //Si no se envia nada en el body a modificar
        if (Object.keys(productUpdate).length === 0) {
        return res.sendBadRequest ('No updates provided. Product not modified' );
         }
        //Chequeo que el pid existe en mi array de productos 
        const result = await productsM.getProductBy({_id: pid})
        if(!result) return res.status(404).send({ status: 'error', message: 'Product not updated because it cannot be found' });
        const updateProduct = await productsM.updateProduct(pid, productUpdate);
       
        //Si Modifico algo retorno que el producto fue modificado con exito
        if (updateProduct) return res.status(201).send({ status: 'success', message: `The product with id ${pid} has been succesfully updated` });
        //Sino devuelvot que no se pudo modifica
        return res.status(404).send({ error: "Update product failed" }); 
    }
    catch (error) {
        console.log(error);
    }
})

//Borra el producto
this.delete('/:pid',['ADMIN'], passportCall('jwt', {strategyType: 'jwt'}), async(req,res) => {
    const { pid } = req.params
    try {
        if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.sendBadRequest ('Please enter a product ID' );
          }
        const resultDelete = await productsM.deleteProduct({_id: pid})
        //Busco el id del producto a eliminar si no lo encuentro devuelvo error sino devuelvo producto eliminado
        if (!resultDelete) return res.sendBadRequest ('Product not found' )
        return res.status(200).send({ status: 'success', message: { resultDelete } });
    }
    catch (error) {
        console.log(error);
    }
})

}
}