window.onload = function () {
    const deleteUserButton = document.getElementById('deleteUserButton');
  
    deleteUserButton.addEventListener('click', async (event) => {
      event.preventDefault();
  
      const confirmed = await showConfirmationDialog();
  
      if (confirmed) {
        const usersToDelete = [];
  
        const userElements = document.querySelectorAll('.user');
        console.log(userElements) // Select all user containers
        userElements.forEach((userElement) => {
          const userId = userElement.querySelector('.userId').innerText.trim();
          const userEmail = userElement.querySelector('.userEmail').innerText.trim();
          usersToDelete.push({ idUsuario: userId, emailUsuario: userEmail });
          userElement.remove(); // Remove user container
        });
  
        await deleteUsers(usersToDelete);
      }
    });
  };
  

  
  
  async function showConfirmationDialog() {
    return Swal.fire({
      title: 'Eliminarlos',
      text: 'Estás seguro que deseas eliminarlos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok',
    }).then((result) => {
      return result.isConfirmed;
    });
  }
  
  async function deleteUsers(usersToDelete) {
    const response = await fetch('/api/sessions/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usersToDelete),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Los usuarios fueron eliminados',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  
  

