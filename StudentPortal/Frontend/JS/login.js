const init_url = "http://localhost:3000";


async function login(event){
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    const response = await fetch(init_url+"/login?username="+username+"&password="+password,{
        method:'POST'
    });
    const body = await response.json();
    if(response.status === 201){
        window.location.href="../HTML/home.html?email="+body.email;
    }
    else if(response.status === 401){
        alert(body.message);
    }
    
   
}

