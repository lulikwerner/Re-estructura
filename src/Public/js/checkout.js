console.log('checkout.js loaded');
const socket = io();

const checkoutButton = document.getElementById('checkoutButton');

checkoutButton.addEventListener('click', Checkout);
function Checkout() {

  console.log('Checkout button clicked');
  // Add your checkout logic here
}

// Call the function after the DOM is loaded
//document.addEventListener('DOMContentLoaded', AddProductToCart);