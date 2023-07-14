console.log('checkout.js loaded');
const socket = io();

const checkoutButton = document.getElementById('checkoutButton');

checkoutButton.addEventListener('click', async () => {
  const cid = checkoutButton.dataset.cid;
  console.log(cid)

  // Make the API request using the cid
  const response = await fetch(`/api/carts/${cid}/purchase`, {
    method: 'POST',
    body: JSON.stringify(),
    headers: {
      "Content-Type": "application/json"
    }
  })
  console.log(response)
  
})

    // Rest of your code


// Call the function after the DOM is loaded
//document.addEventListener('DOMContentLoaded', AddProductToCart);