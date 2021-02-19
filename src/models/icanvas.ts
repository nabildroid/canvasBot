import { AxiosInstance } from "axios";
import { Announcement } from "./types";

export default interface ICanvas {
	server: AxiosInstance;
	courses: { [key in string]: string };
	initServer: (token: string) => AxiosInstance;
	addCourse: (name: string, id: string) => void;
	getCourseAnnouncements: (name: string) => Promise<Announcement[]>;
	getAnnouncements:()=>Promise<Announcement[]>;
	fetchCourses: () => Promise<void>;
}
