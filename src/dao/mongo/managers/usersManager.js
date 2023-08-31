import userModel from "../models/users.js";
import LoggerService from '../../../services/LoggerService.js';
import config from '../../../config.js';


const logger = new LoggerService(config.logger.type); 
export default class UsersManager {
  getUsers = () => {
    return userModel.find().lean();
  };

  getUserBy = async (params) => {
    //console.log('aca',params)
 return await userModel.findOne(params).lean();
  };

  createUsers = async (user) => {
    return await userModel.create(user);
  };

  updateUsers = async (id, updateFields) => {
    return await userModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
  };

  deleteUsers = (id) => {
    return userModel.findByIdAndDelete(id);
  };
}
