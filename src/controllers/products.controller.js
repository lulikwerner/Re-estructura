import { productService } from '../services/repositories.js'
import mongoose from 'mongoose';

const postProducts =  async(req,res) => {
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
        const addedProduct = await productService.createProductService (product);
        //Vuelvo a traer a mis productos
        const resultProducts = await productService.getProductsService();
        req.io.emit('resultProducts', resultProducts)
        //Si queda undefined o null tira error de agregar
        if (!addedProduct) return res.sendNotFound ('Product not added');
        //Devuelo el producto agregado
        return res.send({status:'succes', payload:addedProduct})
    } catch (error) {
        console.log(error);
    }
};

const getProductsById = async (req, res) => {
    const { pid } = req.params;

    try {

        const product = await productService.getProductByService({_id: pid});
      // If the product is not found, send an error response
        if (!product) {
        return res.sendNotFound('Product not found');
        }   
      // If the product is found, send the product information
      res.sendSuccessWithPayload({payload: product });
    } catch (error) {
        console.log(error);
        res.sendInternalError('Internal server error' );
    }
};

const putProducts = async(req,res) => {
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
        const result = await productService.getProductByService({_id: pid})
        if(!result) return res.sendNotFound ('Product not updated because it cannot be found');
        const updateProduct = await productService.updateProductService (pid, productUpdate);
       
        //Si Modifico algo retorno que el producto fue modificado con exito
        if (updateProduct) return res.status(201).send({ status: 'success', message: `The product with id ${pid} has been succesfully updated` });
        //Sino devuelvot que no se pudo modifica
        return res.sendInternalError("Update product failed"); 
    }
    catch (error) {
        console.log(error);
    }
};

const deleteProducts = async(req,res) => {
    const { pid } = req.params
    try {
        if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
            return res.sendBadRequest ('Please enter a product ID' );
          }
        const resultDelete = await productService.deleteProductService({_id: pid})
        //Busco el id del producto a eliminar si no lo encuentro devuelvo error sino devuelvo producto eliminado
        if (!resultDelete) return res.sendBadRequest ('Product not found' )
        return res.status(200).send({ status: 'success', message: { resultDelete } });
    }
    catch (error) {
        console.log(error);
    }
};

export default {
    getProductsById,
    postProducts,
    putProducts,
    deleteProducts
}

