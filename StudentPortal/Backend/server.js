require('dotenv').config();
const express = require('express');
var cors = require('cors');
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Get MongoDB Atlas connection string from environment variables
const dbURI = process.env.DB_URI;

if (!dbURI) {
    console.error("Error: MongoDB Atlas connection string (DB_URI) is not set in environment variables.");
    process.exit(1); // Exit the application if DB_URI is not provided
}

// Connect to MongoDB Atlas
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => {
        console.error("Failed to connect to MongoDB Atlas:", err);
        process.exit(1); // Exit the application if the connection fails
    });

// Define Schemas and Models
const userInformationSchema = {
    username: String,
    email: String,
    password: String,
};

const userPersonalInformationSchema = {
    email: String,
    name: String,
    dob: String,
    address: String,
    phone: String,
};

const courseSchema = {
    name: String,
    day: String,
    time: String,
};

const userRegisteredCourseSchema = {
    email: String,
    name: String,
    day: String,
    time: String,
};

const UserInformation = mongoose.model("UserInformation", userInformationSchema);
const UserPersonalInformation = mongoose.model("UserPersonalInformation", userPersonalInformationSchema);
const Course = mongoose.model("Course", courseSchema);
const UserRegisteredCourse = mongoose.model("UserRegisteredCourse", userRegisteredCourseSchema);

// Routes (Unchanged from previous code)
app.post("/login", (req, res) => {
    const { username, password } = req.query;

    if (!username) {
        res.status(400).json({ message: "Username is not available in request" });
        return;
    }

    if (!password) {
        res.status(400).json({ message: "Password is not available in request" });
        return;
    }

    UserInformation.findOne({ username })
        .then((obj) => {
            if (!obj) {
                res.status(401).json({ message: "User not registered" });
            } else if (obj.password === password) {
                res.status(201).json({ email: obj.email });
            } else {
                res.status(401).json({ message: "Credentials are incorrect" });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Error while querying the database" });
        });
});

// Other routes (Unchanged)...

// Insert initial course records
function insertCourseRecords() {
    Course.deleteMany({})
        .then(() =>
            Course.insertMany([
                { name: "CSC 110", day: "Monday", time: "9.00 am - 9.50 am" },
                { name: "CSC 120", day: "Monday", time: "10.00 am - 10.50 am" },
                { name: "CSC 210", day: "Tuesday", time: "9.00 am - 9.50 am" },
                { name: "CSC 244", day: "Wednesday", time: "1.00 pm - 1.50 pm" },
                { name: "CSC 352", day: "Thursday", time: "9.00 am - 9.50 am" },
                { name: "CSC 453", day: "Thursday", time: "11.00 am - 11.50 am" },
                { name: "CSC 337", day: "Friday", time: "10.00 am - 10.50 am" },
            ])
        )
        .then(() => console.log("Course records inserted"))
        .catch((err) => console.error(err));
}

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
    insertCourseRecords();
});
