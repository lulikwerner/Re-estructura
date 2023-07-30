// Declare checkoutData in the outer scope
let checkoutData;

console.log('checkout.js loaded');

const checkoutButton = document.getElementById('checkoutButton');

checkoutButton.addEventListener('click', async () => {
  const cid = checkoutButton.dataset.cid;
  console.log(cid);

  // Hago el request a la back
  const response = await fetch(`/api/carts/${cid}/purchase`, {
    method: 'POST',
    body: JSON.stringify(),
    headers: {
      'Content-Type': 'application/json',
      // Add this line to indicate that you expect a JSON response
      'Accept': 'application/json',
    },
  });
  if (response.ok) {
    checkoutData = await response.json(); // Guardo la informacion del fetch
    console.log(checkoutData);

    // Lo dirijo a la ventana de compra
  window.location.href = `/api/carts/${cid}/purchase`;
  } else {
    console.error('Error:', response.status, response.statusText);
  }
});




// Assuming that the button with id "deleteButton" is present in your cartHandlebars
const deleteButton = document.getElementById('dButton');

deleteButton.addEventListener('click', async () => {
  console.log('Delete button clicked!');
  const cid = checkoutButton.dataset.cid;;
  const pid =  deleteButton.getAttribute('data-pid');
  console.log(pid)
  console.log(cid)
  const deleteResponse = await fetch(`/api/carts/${cid}/products/${pid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (deleteResponse.ok) {
    console.log('Product deleted successfully!');
    window.location.reload();
  } else {
    console.error('Failed to delete product from the cart.');
  }
});



let quantity = 0;

const addButton = document.getElementById('addButton');

addButton.addEventListener('click', async () => {
  console.log('Add button clicked!');
  quantity = quantity + 1;
  console.log(quantity);

  const cid = checkoutButton.dataset.cid;
  const pid = deleteButton.getAttribute('data-pid');
  const addQuantity = await fetch(`/api/carts/${cid}/product/${pid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ quantity })
  });
  console.log(addQuantity);
  if (addQuantity.ok) {
    console.log('Product updated successfully!');
     window.location.reload();
  } else {
    console.error('Failed to update product in the cart.');
  }
});


