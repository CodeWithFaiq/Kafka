require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const { connectProducer,consumeKafka } = require("./Kafka/service");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


consumeKafka();


app.post("/post-data", async(req, res) => {
  await connectProducer(req.body.data);
  res.send({ message: "data passed to queue successfully" });
});


app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

module.exports = app;
