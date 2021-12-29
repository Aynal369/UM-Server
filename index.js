const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://Aynal:tPLYZwk6hJkeyMxf@cluster0.1era9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connect successfully");
    const database = client.db("UserManagement");
    const usersCollection = database.collection("Users");

    // POST API --- Create User
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.json(result);
    });

    // GET API --- Read User
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    //UPDATE API --- Update User
    // Update Get
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });
    // Update put
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const query = { _id: ObjectId(id) };
      console.log("updatedUser", updatedUser);
      // add or update user options
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          fullName: updatedUser.fullName,
          emailAddress: updatedUser.emailAddress,
          phoneNumber: updatedUser.phoneNumber,
          fullAddress: updatedUser.fullAddress,
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.json(result);
    });

    // Delete API --- Delete User
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("User Management");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
