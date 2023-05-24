const socket = io();
// Obtengo el Formulario
const form = document.querySelector('form')
const products = document.getElementById('products');

//Muestro el producto agregado
socket.on('productsAdd', (data) => {
    console.log(data)

    products.innerHTML  += `<div class="card bg-secondary mb-3 mx-4 my-4" style="max-width: 20rem;">
                       
                        <div class="card-body">
                            <h4 class="card-title">${data.title}</h4>
                            <p class="card-text">
                                <li>
                                    id: ${data._id}
                                </li>
                                <li>
                                    category: ${data.category}
                                </li>
                                <li>
                                    description: ${data.description}
                                </li>
                                <li>
                                    price: $${data.price}
                                </li>
                                
                                <li>
                                code: ${data.code}
                            </li>
                                <li>
                                    stock: ${data.stock}
                                </li>
                                <li>
                                status: ${data.status}
                                </li>
                                <li>
                                    thumbnail: ${data.thumbnails}
                                </li>
                            </p>
                        </div>
                        <div class="d-flex justify-content-center mb-4">
                            <button type="button" class=" btn btn-danger" id="${data._id}">Delete</button>
                            <br>
                        </div>
                        
                    </div>
                </div>`;
  

    btnDelete(); // Call btnEliminar function here
})


//Muestro todos los productos
socket.on('products', (data) => {
    let productos = '';
   data.forEach(producto => {
        productos += `<div class="card bg-secondary mb-3 mx-4 my-4" style="max-width: 20rem;">
                       
                        <div class="card-body">
                            <h4 class="card-title">${producto.title}</h4>
                            <p class="card-text">
                                <li>
                                    id: ${producto._id}
                                </li>
                                <li>
                                    category: ${producto.category}
                                </li>
                                <li>
                                    description: ${producto.description}
                                </li>
                                <li>
                                    price: $${producto.price}
                                </li>
                                
                                <li>
                                code: ${producto.code}
                            </li>
                                <li>
                                    stock: ${producto.stock}
                                </li>
                                <li>
                                status: ${producto.status}
                                </li>
                                <li>
                                    thumbnail: ${producto.thumbnails}
                                </li>
                            </p>
                        </div>
                        <div class="d-flex justify-content-center mb-4">
                            <button type="button" class=" btn btn-danger" id="${producto._id}">Delete</button>
                            <br>
                        </div>
                        
                    </div>
                </div>`;
    });
    products.innerHTML = productos;
    btnDelete(); // Call btnEliminar function here
});


const btnDelete = () => {
    const buttons = document.querySelectorAll('.btn-danger')
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log(`Deleting product with id ${btn.id}`);
            socket.emit('deleteProduct', btn.id)
        })
    })
}

// Listen for the submit event on the form  
form.addEventListener('submit', event => {
    event.preventDefault();
    console.log("Submit event listener function called");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    socket.emit('newProduct', data);
  
   
    form.reset();
  });