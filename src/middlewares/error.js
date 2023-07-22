

export default (error,req,res,next) => { //Este define que nunca caiga el Server
    console.log(error)
    res.status(error.status).send({status:'error', error:error.message})
   
}