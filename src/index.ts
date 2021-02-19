import Canvas from "./canvas";
import { CANVAS_TOKEN } from "./config";
import admin from "firebase-admin";
import Firestore from "./firestore";
import App from "./app";
import Bot from "./bot";
const serviceAccount = require("../service_account.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://canvasbot-5bcfd.firebaseio.com",
});

const app = new App(
	new Firestore(admin.firestore()),
	new Canvas(CANVAS_TOKEN),
	new Bot("botToken")
);

app.run();
