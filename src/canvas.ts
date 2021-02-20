import axios, { AxiosInstance } from "axios";
import ICanvas from "./models/icanvas";
import { AnnonceType, Announcement } from "./models/types";
import Turndown from "turndown";
export default class Canvas implements ICanvas {
	server: AxiosInstance;
	courses: { [x: string]: string };

	cache: {
		announcements: number[];
	};

	constructor(token: string) {
		this.server = this.initServer(token);
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
		const turndownService = new Turndown();

		return this.server
			.get<any[]>(`announcements`, {
				params: {
					"context_codes[]": `course_${this.courses[courseName]}`,
				},
			})
			.then((response) => {
				return response.data
					.map<Announcement>((d) => ({
						id: d.id,
						author: d.author.display_name,
						date: new Date(d.posted_at),
						message: turndownService.turndown(d.message),
						title: d.title,
						url: d.url,
						module: courseName,
						type: this.getAnnouncementType(d.title, d.message),
					}))
					.filter(({ id }) => !this.cache.announcements.includes(id))
					.map((announce) => {
						this.cache.announcements.push(announce.id);
						return announce;
					});
			});
	}

	getAnnouncementType(title: string, content: string) {
		if (title.includes("zoom") || content.includes("zoom"))
			return AnnonceType.ZOOM;

		return AnnonceType.NONE;
	}

	getAnnouncements() {
		//TODO get announcements from all avaliable courses
		return Promise.resolve([]);
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
