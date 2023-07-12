export default class createProductDTO {
    constructor(product){
        this.title = product.title,
        this.price = product.price,
        this.description = product.description || 'Sin descripcion'
    }
}