document.addEventListener('DOMContentLoaded', () => {
    const roleForm = document.getElementById('roleForm');
    const modifyRole = document.getElementById('modifyRole');

    roleForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submitted');
        const formData = new FormData(roleForm);
        const role = formData.get('role');
        const userId = modifyRole.getAttribute('data-id');

        //Le envio el nuevo role del usuario
        try {
            const response = await fetch(`/api/users/premium/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({role} )
            });

            if (response.ok) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Tienes un nuevo role asignado`,
                    showConfirmButton: false,
                    timer: 1500
                  })
                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
            }
            else{
                const responseData = await response.json(); 

                if (responseData.notUploadFiles) {
                    const missingFiles = responseData.notUploadFiles.map(file => file.name).join(', ');
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'No puedes modifcar el rol',
                    text: `Faltan cargar documentos a tu perfil: ${missingFiles}`,
                    showConfirmButton: false,
                    timer: 3000
                  });
                  setTimeout(() => {
                    window.location.href = `http://localhost:8080/premium/${userId}/documents`;
                  }, 3000);
                }}
        } catch (error) {
            console.error('Error:', error);
        }
    });
});


