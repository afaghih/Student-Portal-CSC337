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
    const response = await fetch(init_url+'/getCourses');
    const data = await response.json();
    if(response.status == 200){
        const arr = await data.records;
        if(arr != null){
            let table = document.getElementById("courses");
            arr.map(obj=>{
                let newRow = table.insertRow(table.rows.length);
                newRow.insertCell(0).innerHTML = obj.name;
                newRow.insertCell(1).innerHTML = obj.day;
                newRow.insertCell(2).innerHTML = obj.time;
                newRow.insertCell(3).innerHTML = "<button id='add' onclick='addCourse(this)'>Add</button>"
            });
        }
    }
    
}

async function addCourse(button){
    let row = button.parentNode.parentNode; 
    const response = await fetch(init_url+'/registerCourse', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            email: email,
            name: row.cells[0].innerHTML,
            day: row.cells[1].innerHTML,
            time: row.cells[2].innerHTML
        })
    });
    const data = await response.json();
    alert(data.message);
}

