import IFirestore from "./models/ifirestore";
import { Announcement } from "./models/types";

export default class Firestore implements IFirestore {
	db: FirebaseFirestore.Firestore;

	constructor(database: FirebaseFirestore.Firestore) {
		this.db = database;
	}
	async addAnnouncement(announce: Announcement) {
		await this.db.collection("announcements").add(announce);
    }
    
	async isNewAnnouncement(id: number) {
        const query = this.db.collection("announcements").where("id","!=",id);
        const data =await query.get();
        return data.empty
    }
}
