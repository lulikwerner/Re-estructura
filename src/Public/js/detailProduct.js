
const AddProductToCart = () => {
  const addProductButtons = document.querySelectorAll('.addButtonStyle');
  addProductButtons.forEach(btn => { 
    btn.addEventListener('click', async () => {
      // Check if user is logged in
      if (user) {
        const pid = btn.getAttribute('data-id');
        console.log('Product ID:', pid);

        // Emit the 'addedProduct' event with user information
        socket.emit('addedProduct', { productId: pid, userId: user.id });
      } else {
        console.log('User not logged in');
        // Handle the case where the user is not logged in
      }
    });
  });
};

// Call the function after the DOM is loaded
document.addEventListener('DOMContentLoaded', AddProductToCart);



/*const AddProductToCart = () => {
  const addProductButtons = document.querySelectorAll('.addButtonStyle');
  addProductButtons.forEach(btn => { 
    btn.addEventListener('click', () => {
      const clickCount = 0; 
      const pid = btn.getAttribute('data-id');
      console.log('Product ID:', pid);
      socket.emit('addedProduct', pid)
    });
  });
};*/








