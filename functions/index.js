const functions = require("firebase-functions");
const express = require("express");
// const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();


const app = express();

app.get("/", async (req, res) => {
  const snapshot = await admin.firestore().collection("webexRoomIds").get();
  const rooms = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    rooms.push({id, ...data});
  });
  res.status(200).send(JSON.stringify(rooms));
});

app.post("/", async (req, res) => {
  const room = req.body; // Grabs the Webex Room Details
  await admin.firestore().collection("webexRoomIds").doc(req.body.title).set(room);
  res.status(201).send();
});

exports.webexRoomIds = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/wrete-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
