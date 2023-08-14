export default class CartRepository {
    constructor(dao){
        this.dao = dao;
    }
    getCartsService = () => {
        return  this.dao.getCartBy();
    }
    getCartByIdService = (cid) => {
        return this.dao.getCartById(cid);
    }

    createCartService = (cart) => {
        return this.dao.createCart(cart);
    }

    updateCartService = (products, cid, quantity) => {
        return this.dao.updateCart(products, cid, quantity);
    }

    updateProductsInCartService = (cid, products) => {
        return this.dao.updateProductsInCart(cid, products); //ver
    }

    updateQtyCartService = (cid, pid, qty) => {
        return this.dao.updateQtyCart(cid, pid,qty);
    } //ver
    
    deleteCartService = (cid) => {
        return this.dao.deleteCart(cid);
    }

    deleteProductInCartService = (cid, products) => {
        return this.dao.deleteProductInCart(cid, products);
    }

    emptyCartService = (cid) => {
        return this.dao.emptyCart(cid);
    }
    findOneandUpdateServices = (cid,cart) =>{
    return this.dao.updateOneProductInCart(cid,cart)
}


}