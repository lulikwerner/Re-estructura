

console.log('detailProduct.js loaded');
const socket = io();


const AddProductToCart =  () => {
  const addProductButtons = document.querySelectorAll('.addButtonStyle');
  addProductButtons.forEach(btn => { 
    btn.addEventListener('click', async() => {

      const pid = btn.getAttribute('data-id');
      console.log('Product ID:', pid);
      socket.emit('addedProduct', pid)
    });
  });
};
// Call the function after the DOM is loaded
document.addEventListener('DOMContentLoaded', AddProductToCart);


const cartButton = document.getElementById('CartButton');

cartButton.addEventListener('click', async (event) => {
  event.preventDefault();
  //Traigo la informacion del user desde current
  const response = await fetch('/api/sessions/current', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
//Si me trae info entonces extraigo el cid
  if (response.ok) {
    const data = await response.json();
    const cid = data.message.cart; 
    //Le paso el cid a la ruta y me redirije a la misma
    if (cid) {
      window.location.replace(`/api/carts/${cid}`);
    } else {
      console.error('Invalid cart ID');
    }
  } else {
    console.error('Failed to fetch current session');
  }
});
