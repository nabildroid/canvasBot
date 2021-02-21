import { Announcement, Pinned } from "./types";

export default interface IFirestore {
	db: FirebaseFirestore.Firestore;

	addAnnouncement: (announce: Announcement) => Promise<void>;
	isNewAnnouncement: (id: number) => Promise<boolean>;

	pin: (id: string, module: string, duration?: number) => Promise<void>;
	unpin: (field:"id"|"module",value:string) => Promise<Pinned[]>;
	deleteExpiredPins: () => Promise<Pinned[]>;
}
