import { Announcement } from "./types";

export default interface IFirestore {
	db: FirebaseFirestore.Firestore;

	addAnnouncement: (announce: Announcement) => Promise<void>;
    isNewAnnouncement: (id: number) => Promise<boolean>;
    
}
