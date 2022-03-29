const functions = require("firebase-functions");
const express = require("express");

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

app.get("/:id", async (req, res) => {
  const snapshot = await admin.firestore().collection("webexRoomIds").doc(req.params.id).get();
  const roomId = snapshot.id;
  const roomData = snapshot.data();
  res.status(200).send(JSON.stringify({id: roomId, ...roomData}));
});

app.post("/", async (req, res) => {
  const room = req.body; // Grabs the Webex Room Details
  await admin.firestore().collection("webexRoomIds").doc(req.body.eventId).set(room);
  res.status(201).send();
});

exports.webexRoomIds = functions.https.onRequest(app);