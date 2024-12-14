const init_url = "http://localhost:3000";




async function registerUser(event){
   event.preventDefault();
   const email = document.getElementById("email").value;
   const username = document.getElementById("username").value;
   const password = document.getElementById("password").value;
   const cnfpassword = document.getElementById("cnfpassword").value;

   if(password != cnfpassword){
      alert("Both password are not same");
      return;
   }
   const response = await fetch(init_url+'/register', {
      method:'POST',
      headers:{
         'Content-Type':'application/json'
      },
      body:JSON.stringify({
         user:{
            username:username,
            email:email,
            password:password
         }
      })
   });

   const body = await response.json();
   alert(body.message);
   if(response.status == 201){
      window.location.href = "../HTML/index.html";
   }
   
}