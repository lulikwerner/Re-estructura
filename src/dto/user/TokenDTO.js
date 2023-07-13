export default class TokenDTO {
    constructor(user){
        this.name = `${user.first_name} ${user.last_name}`,
        this.id = user._id,  
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.age = user.age||0,
        this.cart =  user.cart, //aca me tiene que traer el id del cart
        this.email = user.email,
        this.role = user.role
    }
}

//Para enviar en el current y en el profile
/*   Esto esta en passport config user = {
        id:user._id,  
        first_name: user.first_name,
        last_name: user.last_name,
        age:user.age,
        cart: user.cart, //aca me tiene que traer el id del cart
        email: user.email,
        role: user.role
    };*/