var email = null;
const init_url = "http://localhost:3000";

window.onload = ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    email = urlParams.get('email'); 
    if(email != null){
        getUserData();
    }
}


function goToHome(){
    window.location.href = "../HTML/home.html?email="+email;
}


async function editPersonalDetails(event){
    event.preventDefault();
    if(email != null){
        const response = await fetch(init_url+'/edituserdetails?email='+email ,{
            method:"POST",
            headers:{
                'Content-Type':"application/json"
            },
            body: JSON.stringify({
                name: document.getElementById("name").value,
                dob: document.getElementById("dob").value,
                address: document.getElementById("address").value,
                phone: document.getElementById("phone").value
            })
        });
        const body = await response.json();
        if(response.status == 201){
            alert("User Record Updated Successfully");
            goToHome();
        }
        else{
            alert("Error while updating the record");
            console.log(body);
        }
        
    } 
}

async function getUserData(){
    const response = await fetch(init_url+"/userpersonaldetails?email="+email);
    if(response.status == 200){
        const data = await response.json();
        const user = data.user;
        if(user != null){
            document.getElementById("name").value = user.name;
            document.getElementById("dob").value = user.dob;
            document.getElementById("address").value = user.address;
            document.getElementById("phone").value = user.phone;
        }
    }
}

