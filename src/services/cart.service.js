export default class CartService {
    constructor(dao){
        this.dao = dao;
    }
    getCartsService = () => {
        return this.dao.getCartBy();
    }
    getCartByIdService = (cid) => {
        return this.dao.getCartById(cid);
    }

    createCartService = (cart) => {
        return this.dao.createCart(cart);
    }

    updateCartService = (products, cid) => {
        return this.dao.updateCart(products, cid);
    }

    updateProductsInCartService = (cid, products) => {
        return this.dao.updateProductsInCart(cid, products);
    }

    updateQtyCartService = (cid, pid, qty) => {
        return this.dao.updateQtyCart(cid, pid, qty);
    }
    
    deleteCartService = (cid) => {
        return this.dao.deleteCart(cid);
    }

    deleteProductInCartService = (cid, products) => {
        return this.dao.deleteProductInCart(cid, products);
    }

    emptyCartService = (cid) => {
        return this.dao.emptyCart(cid);
    }


}