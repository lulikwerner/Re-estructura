import {faker} from '@faker-js/faker'
import mongoose from 'mongoose'

export const generateProducts = () =>{

    const cod = ['WARO', 'WACA', 'WACH', 'WAAP', 'WAPA']
    return {
       
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code : faker.helpers.arrayElement(cod),
        //code: faker.string.alphanumeric(10),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({min:0,max:20}),
        thumbnail: faker.image.avatar(),
        _id: faker.database.mongodbObjectId(),
        created_at:faker.date.recent(), 
        updated_at: faker.date.recent(),
        

    }
}