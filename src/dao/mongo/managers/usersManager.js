import userModel from "../models/users.js";


export default class UsersManager {


    getUsers = () => {
        return userModel.find().lean();
    };
    
    getUserBy = (params) => {
       return userModel.findOne(params).lean();
    };

    createUsers = async (user) => {
        return  userModel.create(user);
    };

    updateUsers = (id, user) => {
        return userModel.findByIdAndUpdate(id,{$set:user});
    };

    deleteUsers = (id) => {
        return userModel.findByIdAndDelete(id);
    };

}

