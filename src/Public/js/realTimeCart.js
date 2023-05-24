const socket = io();

console.log('entro al realtimecart')


socket.on('homeCart', home => {
    const homeContent = document.getElementById('cartContent');
    let cartContent = "";
    let content = "";

    home.forEach(product=> {

        content += `<div class="col-6 card  shadow center m-3" style="max-width: 20rem">
                        <h3 class="text-center" style="color:blue"> cart:${cart.id}</h3>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"> Cart : ${cart.products}</li> 
                           
                        </ul>
                        
                    </div>
                    <button class="col-6  mx-3 mb-5  center btn btn-danger" type="submit" style="max-width: 20rem" id="${cart.id}">Eliminar carto</button>`
        // title : ${cart.title} //  description: ${cart.description} // code:${cart.code} --- id: ${cart.id} <br/>
    });
    homeContent.innerHTML = content;
});

