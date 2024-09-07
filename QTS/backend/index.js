import express from "express";
import { PORT, HOST, USER, PASSWORD } from "./config.js";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app
  .listen(PORT, () => {
    console.log("Listening on Port", PORT);
  })
  .on("error", (e) => {
    console.log("Error Occured (", e.message, ")");
  });

const connection = await mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: "quizdb",
});

const checkConnection = () => {
  connection.connect((error) => {
    if (error) {
      console.log("Failed to Connect to Database (", error, ")");
    } else {
      console.log("Connected to Database.");
    }
  });
};

checkConnection();

app.get("/questions", (req, res) => {
  const query =
    "SELECT id, question FROM questions WHERE topic_id IS NULL OR subtopic_id IS NULL";
  connection.query(query, (error, data) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.json(data);
  });
});

app.get("/topics", (req, res) => {
  const query = "SELECT id, topic FROM topics";
  connection.query(query, (error, data) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.json(data);
  });
});

app.get("/subtopics", (req, res) => {
  const query = "SELECT * FROM subtopics";
  connection.query(query, (error, data) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.json(data);
  });
});

app.patch("/update", (req, res) => {
  const updates = req.body;

  // Prepare to collect results and errors
  const results = [];
  let errors = false;

  // Use a promise-based approach to handle asynchronous operations
  const updatePromises = updates.map((update) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE questions
        SET topic_id = ?, subtopic_id = ?
        WHERE id = ?
      `;

      connection.query(
        query,
        [update.topicId, update.subtopicId, update.questionId],
        (error, result) => {
          if (error) {
            errors = true; // Track if any errors occurred
            reject(error); // Reject the promise with the error
          } else {
            results.push(result); // Collect results
            resolve(result); // Resolve the promise
          }
        }
      );
    });
  });

  // Wait for all update promises to complete
  Promise.all(updatePromises)
    .then(() => {
      if (errors) {
        res.status(500).send("Some updates failed.");
      } else {
        res.send("Questions updated successfully.");
      }
    })
    .catch((error) => {
      res.status(500).send("Error occurred during updates.");
    });
});

app.delete("/reset", (req, res) => {
  const query = "UPDATE questions SET topic_id = NULL, subtopic_id = NULL";
  connection.query(query, (error, data) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.status(200).send("Reset successfull.");
  });
});
