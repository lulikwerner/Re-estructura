export default class createProductDTO {
    constructor(product){
        this.title = product.title,
        this.price = product.price,
        this.description = product.description || 'Sin descripcion',
        this.status = product.status || 'active',
        this.stock = product.stock || 0,
        this.category = product.category,
        this.thumbnails = product.thumbnails|| 'No image'
    }
}

//para product.sockets.js