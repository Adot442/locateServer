import express from "express";
import {} from 'dotenv/config';

import { MongoClient, ServerApiVersion } from "mongodb";
const url = "mongodb+srv://escanorsprid3:" 
      + process.env.MONGO_PASSWORD + 
      "@cluster0.xii7r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();
const PORT = 3000;


app.get("/load-comments", async (req, res) => {
  try {
    // Connect the client to the server
    await client.connect();

    // Access the sample_mflix database
    const database = client.db("sample_mflix");

    // Access the comments collection
    const commentsCollection = database.collection("comments")
    const sampleComment = await commentsCollection.findOne();
    console.log("Sample Comment1:", sampleComment);

    const documents = await commentsCollection.find({}).toArray();
    for (const doc of documents) {
      console.log(doc)
    };

    if (sampleComment) {
      res.status(200).json({
        message: "Sample comment retrieved successfully",
        data: documents,
      });
    } else {
      res.status(404).json({ message: "No comments found" });
    }
  } catch (error) {
    console.error("Error loading comments from MongoDB:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    // Ensures that the client will close
    await client.close();
  }
});

app.get("/load-movie", async (req, res) => {
  try {
    // Connect the client to the server
    await client.connect();

    // Access the sample_mflix database
    const database = client.db("sample_mflix");

    // Access the comments collection
    const movieCollection = database.collection("embedded_movies")
    const sampleMovie = await movieCollection.findOne();
    console.log("Sample movie:", sampleMovie.title);

    if (sampleMovie) {
      res.status(200).json({
        message: "Sample movie retrieved successfully",
        data: sampleMovie.title,
      });
    } else {
      res.status(404).json({ message: "No comments found" });
    }
  } catch (error) {
    console.error("Error loading comments from MongoDB:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    // Ensures that the client will close
    await client.close();
  }
});

app.post("/post-driver", async (req, res) => {
  // Connect the client to the server
  try {
    await client.connect();

    // Access the sample_mflix database
    const database = client.db("driverLoc");
    const driverCollection = database.collection("driver");
    const driver = {"number" : 3,
                    "name" : "Sam", 
                    "time" : "1:05", 
                    "coordinates" : [12,5]};
    driverCollection.insertOne(driver);

    res.status(200).json({message: "Successful upload"});
  } catch (error) {
    console.error("Error inserting driver in Mongo");
    res.status(500).json({ message: "Error inserting data"});
  } finally {
    await client.close();
  }
});




app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.get("/2", (req, res) => {
    res.send("Hello from Abdou");
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});

