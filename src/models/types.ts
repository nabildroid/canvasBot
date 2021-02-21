export interface Announcement {
	id: number;
	author: string;
	date: Date;
	message: string;
	title: string;
	url: string;
	module: string;
	type: AnnonceType;
}

export enum AnnonceType {
	ZOOM,
	NONE,
}

export enum Mention {
	GRP1 = "@GRP1",
	GRP2 = "@GRP2",
	GRP3 = "@GRP3",
	GRP4 = "@GRP4",
	ALL = "@everyone",
}

export interface Pinned {
	id: string;
	module: string;
	pin: Date;
	unpin: Date | null;
}
