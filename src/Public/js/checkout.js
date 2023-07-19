// Declare checkoutData in the outer scope
let checkoutData;

console.log('checkout.js loaded');

const checkoutButton = document.getElementById('checkoutButton');

checkoutButton.addEventListener('click', async () => {
  const cid = checkoutButton.dataset.cid;
  console.log(cid);

  // Make the API request to trigger the checkoutCart function in the backend
  const response = await fetch(`/api/carts/${cid}/purchase`, {
    method: 'POST',
    body: JSON.stringify(),
    headers: {
      'Content-Type': 'application/json',
      // Add this line to indicate that you expect a JSON response
      'Accept': 'application/json',
    },
  });
console.log('noresp')
  if (response.ok) {
    checkoutData = await response.json(); // Assign the fetched data to checkoutData variable
    console.log('estaok');
    console.log(checkoutData);

    // Use the data to display or perform any other actions
  window.location.href = `/api/carts/${cid}/purchase`;
  } else {
    // Handle the case where the response is not successful (e.g., error handling)
    console.error('Error:', response.status, response.statusText);
  }
});


  


