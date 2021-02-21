import axios, { AxiosInstance } from "axios";
import ICanvas from "./models/icanvas";
import { AnnonceType, Announcement } from "./models/types";
import Turndown from "turndown";
export default class Canvas implements ICanvas {
	server: AxiosInstance;
	courses: { [courseName: string]: string };

	cache: {
		announcements: number[];
	};
	html2md: Turndown;

	constructor(token: string) {
		this.server = this.initServer(token);
		this.html2md = new Turndown();

		this.courses = {};

		this.cache = {
			announcements: [],
		};
	}

	initServer(token: string) {
		return axios.create({
			baseURL: "https://canvas.instructure.com/api/v1/",
			headers: { Authorization: `Bearer ${token}` },
		});
	}

	addCourse(name: string, id: string) {
		this.courses[name] = id;
	}

	async getCourseAnnouncements(courseName: string) {
		const id = this.courses[courseName];
		const announcements = await this.requestAnnounces([id]);

		return this.parseAnnouncements(announcements);
	}

	async getAnnouncements() {
		const ids = Object.values(this.courses);
		const announcements = await this.requestAnnounces(ids);

		return this.parseAnnouncements(announcements);
	}

	requestAnnounces(courseIds: string[]) {
		const context_codes = courseIds.map((v) => `course_${v}`);
		return this.server
			.get<any[]>(`announcements`, {
				params: {
					context_codes,
				},
			})
			.then((r) => r.data);
	}

	findCourseNameFromContextCode(code: string) {
		for (const course in this.courses) {
			if (`course_${this.courses[course]}` == code) return course;
		}
		throw Error("couse code doesn't match the courses in Canvas Object");
	}

	parseAnnouncements(announcements: any[]) {
		return announcements.map<Announcement>((d) => ({
			id: d.id,
			author: d.author.display_name,
			date: new Date(d.posted_at),
			message: this.html2md.turndown(d.message),
			title: d.title,
			url: d.url,
			module: this.findCourseNameFromContextCode(d.context_code),
			type: this.getAnnouncementType(d.title, d.message),
		}));
	}
	getAnnouncementType(title: string, content: string) {
		if (title.includes("zoom") || content.includes("zoom"))
			return AnnonceType.ZOOM;

		return AnnonceType.NONE;
	}

	async fetchCourses() {
		return this.server.get("courses").then((response) => {
			return;
		});
	}

	async ping() {
		const request = await axios.get(
			"https://jsonplaceholder.typicode.com/todos/1"
		);
		console.log(request.data);
	}
}
