const form = document.getElementById('registerForm')

form.addEventListener('submit', async(event)=>{
    event.preventDefault();
    const data = new FormData(form);
    const  obj ={};
    data.forEach((value,key)=>(obj[key] = value));
    const response = await fetch('/api/sessions/register', {
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }

    })
    const responseData = await response.json();
    if(responseData.status ==="succes"){
        Swal.fire({
            toast:true,
            position:'top-end',
            showConfirmButton: false,
            timer:2000,
            title:`Se ha registrado exitosamente`,
            icon:"succes"
        })
        window.location.replace('/login');
    }else{
        Swal.fire({
            toast:true,
            position:'top-end',
            showConfirmButton: false,
            timer:2000,
            title:`Por favor complete todos los campos`,
            icon:"error"
        }) 
    }
    
})