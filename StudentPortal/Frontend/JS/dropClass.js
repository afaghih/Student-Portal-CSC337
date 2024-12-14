var email = null;
const init_url = "http://localhost:3000";

window.onload =()=>{
    const urlParams = new URLSearchParams(window.location.search);
    email = urlParams.get('email');
    getCourses();
}

function goToHome(){
    window.location.href = "../HTML/home.html?email="+email;
}



async function getCourses(){
    const response = await fetch(init_url+'/getUserCourse?email='+email);
    const data = await response.json();
    if(response.status == 200){
        const arr = await data.data;
        if(arr != null){
            let table = document.getElementById("courses");
            arr.map(obj=>{
                let newRow = table.insertRow(table.rows.length);
                newRow.insertCell(0).innerHTML = obj.name;
                newRow.insertCell(1).innerHTML = obj.day;
                newRow.insertCell(2).innerHTML = obj.time;
                newRow.insertCell(3).innerHTML = "<button id='delete' onclick='deleteClass(this)'>Drop</button>"
            });
        }
    }
    
}

async function deleteClass(button){
    let row = button.parentNode.parentNode; 
    const response = await fetch(init_url+'/deleteCourse', {
        method:'DELETE',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            email: email,
            name: row.cells[0].innerHTML,
        })
    });

    if(response.status == 204){
        alert("Class dropped successfully");
        row.parentNode.removeChild(row);
    }
    else{
        alert("Not able to drop the class");
    }
}

