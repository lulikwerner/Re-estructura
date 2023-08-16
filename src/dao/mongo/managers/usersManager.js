import userModel from "../models/users.js";


export default class UsersManager {


    getUsers = () => {
        return userModel.find().lean();
    };
    getUserBy = async (params) => {
            return await userModel.findOne(params).lean();
    };
    

    createUsers = async (user) => {
        return  userModel.create(user);
    };

    updateUsers = async (id, updateFields) => {
            return await userModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true });  
    };

    
    deleteUsers = (id) => {
        return userModel.findByIdAndDelete(id);
    };

}

