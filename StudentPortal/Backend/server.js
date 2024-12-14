const express = require('express')
var cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = 3000
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/studentportal")

const userInformationSchema = {
    username: String,
    email: String,
    password: String,
}


const userPersonalInformationSchema ={
    email: String,
    name: String,
    dob: String,
    address: String,
    phone: String,
}


const courseSchema = {
    name: String,
    day: String,
    time: String
}

const userRegisteredCourseSchema = {
    email: String,
    name: String,
    day: String,
    time: String
}

const UserInformation = mongoose.model("UserInformation", userInformationSchema);
const UserPersonalInformation = mongoose.model("UserPersonalInformation", userPersonalInformationSchema);
const Course = mongoose.model("Course", courseSchema);
const UserRegisteredCourse = mongoose.model("UserRegisteredCourse", userRegisteredCourseSchema)

 app.post("/login", (req, res) =>{
    
    username = req.query.username;
    password = req.query.password;

    if(username == null){
        res.status(400).json({message:"username is not available in request"});
        return;
    }
    
    if(password == null){
        res.status(400).json({message:"password in not available in request"});
        return;
    }

    

    UserInformation.findOne({username:req.query.username}).
    then((obj)=>{
        if(obj === null){
            res.status(401).json({message:"User not registered"});
            return; 
        }
        else{
            if(obj.password === password){
                res.status(201).json({email:obj.email});
            } 
            else{
                res.status(401).json({message:"Credentials are incorrect"});
            }
            
            return; 
        }
    }).
    catch((error)=>{
        console.log(error);
        res.status(500).json({message:"Error while query in database"});
        
    });
    return;
});

app.post("/register" , (req, res)=>{
    UserInformation.findOne({username: req.body.user.username, email:req.body.user.email}).
    then((user)=>{
        if(user == null){
            const userInfo =  new UserInformation({
                username: req.body.user.username,
                email: req.body.user.email,
                password: req.body.user.password
            });
            userInfo.save()
            .then(()=>{
                console.log("user saved successfully");
                res.status(201).json({message:"User registered"});  
            })
            .catch((err) =>{
                console.log(err);
                res.status(500).json({message:"Not able to register data"});
            });
            return;
        }
        else{
            res.status(409).json({message:"User already registered"});
            return;
        }

    }).catch((err)=>{
        console.log(err);
        res.status(500).json({message:"Not able to register data"});
    });

    return;
});


app.get("/userpersonaldetails",(req, res) =>{
    UserPersonalInformation.findOne({email: req.query.email}).
    then((obj)=>{
        res.status(200).json({user:obj});
    }).
    catch(err =>{
        res.status(500).json({message:err});
    });
    return;
});


app.post("/edituserdetails", (req, res) =>{
    UserPersonalInformation.updateOne({email: req.query.email}, {
        name: req.body.name,
        dob: req.body.dob,
        address: req.body.address,
        phone: req.body.phone
    }, {upsert: true}).
    then(obj=>{
        res.status(201).json({message:"record update"});
    }).
    catch(err =>{
        res.status(500).json({message:err});
    });
    return;
});

app.get("/getCourses", (req,res)=>{
    Course.find({}).
    then(obj=>{
        res.status(200).json({records:obj});
    }).
    catch(err=>{
        res.status(500).json({message:err})
    });
    return;
});

app.post("/registerCourse", (req, res)=>{
    UserRegisteredCourse.find({email: req.body.email, name:req.body.name}).
    then(obj=>{
        if (obj.length  != 0){
            res.status(409).json({message:"Course already taken by you"});
            return;
        }
        const registerCourse = new UserRegisteredCourse({
            email:req.body.email,
            name: req.body.name ,
            day: req.body.day,
            time: req.body.time
        });
        registerCourse.save().
        then(obj=>{
            res.status(201).json({message: "Course added"});
        }).
        catch(err=>{
            res.status(500).json(
                {
                    message:"Not able to add the course",
                    error: err
                }
            );
        });
    }).
    catch(err =>{
        console.log(err);
        res.status(500).json(
            {
                message:'Not able to add the course',
                error:  err
            });
    });
    return
});

app.delete("/deleteCourse", (req, res) =>{
    UserRegisteredCourse.deleteMany({email:req.body.email, name:req.body.name}).
    then(obj=>{
        res.status(204).json({message:obj});
    }).
    catch(err=>{
        console.log(err);
        res.status(500).json({message:err});
    });
    return;
});


app.get("/getUserCourse", (req, res) =>{
    UserRegisteredCourse.find({email: req.query.email}).
    then(obj=>{
        res.status(200).json({
            data:obj
        });
    }).
    catch(err=>{
        console.log(err);
        res.status(500).json(
            {
                message:"Not able fetch the data",
                error: err
            });
    });
    return;
});

function insertCourseRecords(){
    Course.deleteMany({}).
    then(obj=>{
        Course.insertMany([
            { name: "CSC 110", day: "Monday", time: "9.00 am - 9.50 am"},
            { name: "CSC 120", day: "Monday", time: "10.00 am - 10.50 am"},
            { name: "CSC 210", day: "Tuesday", time: "9.00 am - 9.50 am"},
            { name: "CSC 244", day: "Wednesday", time: "1.00 pm - 1.50 pm"},
            { name: "CSC 352", day: "Thursday", time: "9.00 am - 9.50 am"},
            { name: "CSC 453", day: "Thursday", time: "11.00 am - 11.50 am"},
            { name: "CSC 337", day: "Friday", time: "10.00 am - 10.50 am"}
        ]).then(obj=>{
            console.log('Record Inserted');
        }).
        catch(err=>{
            console.log(err);
        });
    }).
    catch(err =>{
        console.log(err);
    });
}

app.listen(port, ()=>{
   console.log("server started at port 3000");
   insertCourseRecords();
});




