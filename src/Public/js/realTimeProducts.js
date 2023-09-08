document.addEventListener('DOMContentLoaded', () => {
    
  const formProducts = document.getElementById('formProducts');
  const creatProductsFiles = document.getElementById('creatProductsFiles');

  formProducts.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
         //Traigo la informacion del user loggeado
         const user = await fetch('/api/sessions/current', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      });
      if (!user.ok) {
          throw new Error('Failed to fetch current user');
      }
      const data = await user.json();
      //Extraigo la informacion del email y el role del user
      const currentUser = data.message; 
      const userEmail = currentUser.email;

      const formData = new FormData(formProducts);
      
      // Append the userEmail to the formData
      formData.append('userEmail', userEmail);
          const response = await fetch(`/api/products/`, {
              method: 'POST',
              body: formData,
          }); 
          if(response.ok){
          showConfirmationDialog() 
        
          console.log(response)
          }else{
            showNotConfirmationDialog()
          }
        }catch(error){
          console.log(error)
        }
        formProducts.reset();
      })
    })


    async function showConfirmationDialog() {
      return Swal.fire({
          position: 'top-end',
              icon: 'success',
              title: 'Producto agregado exitosamente',
              showConfirmButton: false,
              timer: 1500
          });
      }
  
  async function showNotConfirmationDialog() {
          return Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: 'El producto no se pudo crear',
                  showConfirmButton: false,
                  timer: 1500
              });
          }