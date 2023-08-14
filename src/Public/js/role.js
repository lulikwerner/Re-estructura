// role.js
document.addEventListener('DOMContentLoaded', () => {
    const roleForm = document.getElementById('roleForm');
    roleForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        const formData = new FormData(roleForm);
        const roleId = formData.get('role');
        const userId = modifyRole.getAttribute('data-id');

        const response = await fetch(`/api/sessions/premium/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: roleId })
        });

        const responseData = await response.json();

        if (responseData.status === 'success') {
            alert('User role updated successfully');
            window.location.replace('/profile');
        } else {
            alert('Failed to update user role');
        }
       
    });
//window.location.reload();
});
