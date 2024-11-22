const express = require('express');
const connectDB = require("./connectToDatabase.js")
const User = require("./model/User.js")
const app = express();
connectDB();

// const users = [
//     {
//         id: 1,
//         firstName: "Firoz",
//         lastName: "Akhter",
//         hobby: "Coding"
//     },
//     {
//         id: 2,
//         firstName: "Honey",
//         lastName: "Singh",
//         hobby: "being nice"
//     },
//     {
//         id: 3,
//         firstName: "Vikas",
//         lastName: "Yadav",
//         hobby: "Watching anime"
//     },
//     {
//         id: 4,
//         firstName: "Pradeep",
//         lastName: "Jenna",
//         hobby: "writing shayari"
//     }
// ]

function validationIncoming(req, res, next) {
    console.log("doing validation");
    const { firstName, lastName, hobby } = req.body;
    if (!firstName || !lastName || !hobby) {
        res.status(400).json({ error: "Some of the required field is missing..." });
        return ;
    }
    next();
}

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    // console.log(req.statusCode);
    console.log("method-->", req.method)
    console.log("Url-->", req.url);
    console.log("Status Code-->", req.statusCode);
    next();
});


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to my Express App!');
});

app.get("/users", async (req, res) => {
    // // res.status(200).send(users)
    // res.send("Fetching users data...");
    try {

        const users = await User.find();
        res.status(200).send(users);

    }
    catch (err) {
        res.status(500).send(err);
    }
})


app.get("/users/:id", async (req, res) => {
    // res.send("Fetching specific user data");
    let id = req.params.id;
    try {
        const user = await User.findById(id);
        if(!user) {
            res.status(404).json({error: "User not found"})
            return ;
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json({error: "Wrong ObjectId"})
    }
})

app.post("/user", validationIncoming, async (req, res) => {
    // we will save the user
    // res.send("User saved successfully...")

    try {
        let { firstName, lastName, hobby } = req.body;
        // let id = Date.now();
        let newUser = new User({ firstName, lastName, hobby });
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch (err) {
        res.status(400).json({error: err.message})
    }
})

app.put("/user/:id", validationIncoming, async (req, res) => {
    // we will update the specific user data
    // res.send("User updated successfully...")
    

    try {
        let { firstName, lastName, hobby } = req.body;
        let id = req.params.id;

        let updatedUser = await User.findByIdAndUpdate(
            id,
            {firstName, lastName, hobby}
        )
        if(!updatedUser) {
            res.status(404).json({error: "User not found to update..."})
        }
        res.status(200).json(updatedUser)
    }
    catch(err) {
        res.status(400).json({error: err.message})
    }

})

app.delete("/user/:id", async (req, res) => {
    // delete the user with given id
    // res.send("user deleted successfully...");
    try {
        let id = req.params.id;
        let deletedUser = await User.findByIdAndDelete(id);
        if(!deletedUser) {
            res.status(404).json({error: "User not found to delete..."});
            return ;
        }
        res.status(200).json({message: "User deleted successfully..."})

    }
    catch(err) {
        res.status(400).json({error: "Wrong ObjectId"})
    }

})

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
