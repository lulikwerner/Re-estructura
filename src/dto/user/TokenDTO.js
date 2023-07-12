export default class TokenDTO {
    constructor(user){
        this.name = `${user.name} ${user.lastname}`,
        role = user.role,
        id = user._id
    }
}