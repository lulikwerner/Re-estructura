const form = document.getElementById('loginForm')

form.addEventListener('submit', async(event)=>{
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
    console.log(responseText); // Log the response text
    
    const responseData = JSON.parse(responseText);
    if(responseData.status === "success"){
        // Agregar modale de logeado exitosamente y los datos del usuario
        window.location.replace('/products');
    }
    
})