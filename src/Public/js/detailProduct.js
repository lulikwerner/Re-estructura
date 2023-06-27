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










