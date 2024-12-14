let email = null;
const init_url = "http://localhost:3000";

window.onload = () =>{
    let queryParams = new URLSearchParams(window.location.search);
    email = queryParams.get('email');
    if(email != null){
        loadCourses();
    }
}

async function loadCourses(){
    const response = await fetch(init_url+'/getUserCourse?email='+email);
    const body = await response.json();
    if(response.status == 200){
        const arr = body.data;
        if(arr.length == 0){
            alert("You have not opted any class");
        }
        else{
            let table = document.getElementById('courses');
            arr.map(obj=>{
                let newRow = table.insertRow(table.rows.length);
                newRow.insertCell(0).innerHTML = obj.name;
                newRow.insertCell(1).innerHTML = obj.day;
                newRow.insertCell(2).innerHTML = obj.time;
            });
        }
    }
}


function goToHome(){
    window.location.href = "../HTML/home.html?email="+email;
}