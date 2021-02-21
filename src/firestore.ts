import { stringify } from "querystring";
import IFirestore from "./models/ifirestore";
import { Announcement, Pinned } from "./models/types";

export default class Firestore implements IFirestore {
	db: FirebaseFirestore.Firestore;

	constructor(database: FirebaseFirestore.Firestore) {
		this.db = database;
	}

	async addAnnouncement(announce: Announcement) {
		await this.db.collection("announcements").add(announce);
	}

	async isNewAnnouncement(id: number) {
		const query = this.db.collection("announcements").where("id", "==", id);
		const data = await query.get();
		return data.empty;
	}

	async pin(id: string, module: string, duration?: number) {
		const pin = new Date();
		const unpin = duration ? new Date(Date.now() + duration) : null;

		await this.db.collection("pinned").add({
			id,
			module,
			pin,
			unpin,
		});

		return Promise.resolve();
	}

	async unpin(field: "id" | "module", value: string) {
		const query = await this.db
			.collection("pinned")
			.where(field, "==", value);
		const data = await query.get();
		return data.docs.map((doc) => {
			doc.ref.delete();

			return doc.data() as Pinned;
		});
	}

	async deleteExpiredPins() {
		const now = new Date();
		const query = await this.db
			.collection("pinned")
			.where("unpin", "<=", now);
		const data = await query.get();

		return data.docs.map((doc) => {
			doc.ref.delete();

			return doc.data() as Pinned;
		});
	}
}
