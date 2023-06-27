import { Router } from 'express';
import { passportCall } from '../services/auth.js';


export default class BaseRouter{
    constructor(){
        this.router = Router();
        this.init();
    }
    init(){}

    getRouter = () => this.router;

    get(path,policies,...callbacks){
        this.router.get(path,passportCall('jwt',{strategyType:'jwt'}),this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks));
    }

   post(path,policies,...callbacks){
        this.router.post(path,passportCall('jwt',{strategyType:'jwt'}),this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks));
    }

    put(path,policies,...callbacks){
        this.router.put(path,passportCall('jwt',{strategyType:'jwt'}),this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks));
    }

    delete(path,policies,...callbacks){
        this.router.delete(path,passportCall('jwt',{strategyType:'jwt'}),this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks));
    }

    generateCustomResponses = (req,res,next) =>{
        res.sendSuccess = message => res.send({status:"success",message});
        res.sendSuccessWithPayload = payload => res.send({status:"success",payload});
        res.sendInternalError = error => res.status(500).send({status:'error', error});
        res.sendUnauthorized = error =>res.status(400).send({status:'error',error});
        next();

    }

    handlePolicies = policies => {
        return(req,res,next) => {
            if(policies[0]==='PUBLIC') return next();
        //Viene con el usuario parseado desde JWT
        const user = req.user;
        // Si el usuario quiere acceder a la ruta de logout, permitirlo sin realizar las verificaciones de políticas
        if (req.path === '/logout') return next();
        //Si mis politicas dice NO-AUTH y tengo un usuario le tiro error de unauthorized
        if(policies[0]==='NO_AUTH'&&user) return res.status(401).send({status:'error', error:'Unauthorized'});//No le puedo hacer con generateCustomResponses porque nuestras politicas se registan antes de las respuestas 
        //Si mis politicas dice NO-AUTH y no encuentro un usuario si lo deberia dejar pasar
        if(policies[0]==='NO_AUTH'&&!user) return next();
        //Si no encuentra usuario despues de todas auntentificar las policies si me interesa que exista un user
        if(!user) return res.status(401).send({status:'error', error:req.error});
        //Si existe el usuario y no es publico y no tiene que pasar la auth
        if(!policies.includes(user.role.toUpperCase())) return res.status(403).send({status:'error', error:'Forbidden'});
        //Si cumple con todo continua
        next();
        }
    }

    applyCallbacks(callbacks){
        return callbacks.map(callback=>async(...params) => {
            try{
                await callback.apply(this,params);
            }catch(error){
                params[1].sendInternalError(error);
            }
        })
    }
}