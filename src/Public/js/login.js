const form = document.getElementById('loginForm')

form.addEventListener('submit', async(event)=>{
    console.log('entroalogin')
 
    event.preventDefault();
    const data = new FormData(form);
    const  obj ={};
    data.forEach((value,key)=>(obj[key] = value));
    const response = await fetch('/api/sessions/login', {
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    });

    const responseText = await response.text();
    console.log('soyresponse',responseText); // Log the response text
    const responseData = JSON.parse(responseText);
    const role = responseData.payload.user.role;
    console.log('el rol',role)
    if(responseData.status === "success"){
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Login Exitoso',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            if(responseData.payload.user.role==='user'){
                window.location.replace('/products');
        } else {
            window.location.replace('/realTimeProducts');
        }
        
          });
    }else{
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Usuario o contrasenia invalidos',
            showConfirmButton: false,
            timer: 1500
          });
    }
    
})