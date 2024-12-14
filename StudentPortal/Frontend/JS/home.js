var email = null;

const init_url = "http://localhost:3000";

function editInformation(){
    window.location.href = "../HTML/editinformation.html?email="+email;
}

function addClass(){
    window.location.href = "../HTML/addcourse.html?email="+email;
}

function viewCourses(){
    window.location.href = "../HTML/viewcourses.html?email="+email;    
}

function dropClass(){
    window.location.href = "../HTML/deletecourse.html?email="+email;    
}

window.onload = () =>{
    const urlParams = new URLSearchParams(window.location.search);
    email = urlParams.get('email');
    if (email != null){
        document.getElementById('email').innerHTML = "<b>Email: </b>"+email;
        getUserData();
    }
}

async function getUserData(){
    const response = await fetch(init_url+"/userpersonaldetails?email="+email);
    if(response.status == 200){
        const data = await response.json();
        const user = data.user;
        if(user != null){
            document.getElementById("name").innerHTML = "<b>Name: </b>"+user.name;
            document.getElementById("dob").innerHTML = "<b>Date of Birth: </b>"+user.dob;
            document.getElementById("address").innerHTML = "<b>Address: </b>"+user.address;
            document.getElementById("phone").innerHTML = "<b>Phone: </b>"+user.phone;
        }
    }
}