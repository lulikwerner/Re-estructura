const logOutButton = document.getElementById('logOutButton');

logOutButton.addEventListener('click', () => {
  Swal.fire({
    title: 'Do you want to close the session?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#73be73',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then(response => {
    if (response.isConfirmed) {
      fetch('/api/sessions/logout', {
        method: 'POST'
      })
        .then(response => {
          if (response.ok) {
            window.location.replace('/login');
          } else {
            Swal.fire({
              title: 'Failed to log out',
              icon: 'error'
            });
          }
        })
        .catch(error => {
          console.error('Error logging out:', error);
          Swal.fire({
            title: 'An error occurred',
            text: 'Please try again',
            icon: 'error'
          });
        });
    }
  });
});
