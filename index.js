const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
require("dotenv").config();
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@zyra.l75hwjs.mongodb.net/?appName=Zyra`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("hirebd");
    const jobsCollection = db.collection("jobs");
    const usersCollection = db.collection("users");
    const applicationsCollection = db.collection("applications");

    // Apply for a job
    app.post("/applications", async (req, res) => {
      try {
        const {
          jobId,
          jobTitle,
          company,
          applicantName,
          applicantEmail,
          resumeLink,
          coverLetter,
        } = req.body;

        if (!jobId || !applicantName || !applicantEmail) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await applicationsCollection.insertOne({
          jobId,
          jobTitle,
          company,
          applicantName,
          applicantEmail,
          resumeLink,
          coverLetter,
          created_at: new Date(),
        });

        res.status(201).json({
          success: true,
          applicationId: result.insertedId,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit application" });
      }
    });

    // Get applications by user email
    app.get("/applications", async (req, res) => {
      try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const userApplications = await applicationsCollection
          .find({ applicantEmail: email })
          .toArray();

        res.json(userApplications);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
      }
    });

    // Register user endpoint
    app.post("/users", async (req, res) => {
      try {
        const { name, email, photoURL } = req.body;

        if (!name || !email) {
          return res.status(400).json({ error: "Name and email are required" });
        }

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: "User already registered" });
        }

        const result = await usersCollection.insertOne({
          name,
          email,
          photoURL: photoURL || "https://via.placeholder.com/150",
          created_at: new Date(),
        });

        res.status(201).json({ success: true, userId: result.insertedId });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ success: false, error: "Failed to register user" });
      }
    });

    // Get user by email endpoint
    app.get("/users", async (req, res) => {
      try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const user = await usersCollection.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
      }
    });

    // Endpoint to handle job postings
    app.post("/jobs", async (req, res) => {
      try {
        console.log("Incoming job:", req.body);

        const result = await jobsCollection.insertOne({
          ...req.body,
          created_at: new Date(),
        });

        console.log("Inserted ID:", result.insertedId);

        res.status(201).json({ success: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
      }
    });

    // Endpoint to retrieve all job postings with optional search and category filters
    app.get("/jobs", async (req, res) => {
      try {
        const { search, category } = req.query;

        const query = {};

        // Search by title or company
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
          ];
        }

        // Filter by category
        if (category && category !== "all") {
          query.category = category;
        }

        const jobs = await jobsCollection
          .find(query)
          .sort({ created_at: -1 })
          .toArray();

        res.send(jobs);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch jobs" });
      }
    });

    // Endpoint to retrieve a specific job posting by ID
    const { ObjectId } = require("mongodb");

    app.get("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid job ID" });
        }

        const job = await jobsCollection.findOne({ _id: new ObjectId(id) });

        if (!job) return res.status(404).json({ error: "Job not found" });

        res.json(job);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
      }
    });

    // Endpoint to delete a job posting by ID
    app.delete("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid job ID" });
        }

        const result = await jobsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.json({ success: true, result });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete job" });
      }
    });

    // Endpoint to update a job posting by ID
    app.put("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid job ID" });
        }

        const { _id, ...updatedJob } = req.body;

        const result = await jobsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedJob },
        );

        res.json({ success: true, modified: result.modifiedCount });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update job" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hehei bhaya!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
