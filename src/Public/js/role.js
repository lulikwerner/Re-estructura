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
            const response = await fetch(`/api/sessions/premium/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({role} )
            });

            if (response.ok) {
               window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});


