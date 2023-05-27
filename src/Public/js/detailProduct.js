console.log('detailProduct.js loaded');
const socket = io();

const AddProductToCart = () => {
  const addProductButtons = document.querySelectorAll('.addButtonStyle');
  let clickCount = 0;
  addProductButtons.forEach(btn => { 
    btn.addEventListener('click', () => {
      clickCount = 0; 
      const pid = btn.getAttribute('data-id');
      console.log('Product ID:', pid);
      socket.emit('addedProduct', pid)
    });
  });
};

// Call the function after the DOM is loaded
document.addEventListener('DOMContentLoaded', AddProductToCart);




//document.getElementById('addProductButton').addEventListener('click', AddProductToCart);

