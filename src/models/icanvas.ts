import { AxiosInstance } from "axios";
import { Announcement } from "./types";

export default interface ICanvas {
	addCourse: (name: string, id: string) => void;
	getCourseAnnouncements: (name: string) => Promise<Announcement[]>;
	getAnnouncements:()=>Promise<Announcement[]>;
	fetchCourses: () => Promise<void>;
}
