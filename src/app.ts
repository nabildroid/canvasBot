import IApp from "./models/iapp";
import IBot from "./models/ibot";
import ICanvas from "./models/icanvas";
import IFirestore from "./models/ifirestore";
import { AnnonceType } from "./models/types";

export default class App implements IApp {
	db: IFirestore;
	canvas: ICanvas;
	checkTimer?: NodeJS.Timeout;
	bot: IBot;

	constructor(db: IFirestore, canvas: ICanvas, bot: IBot) {
		this.db = db;
		this.canvas = canvas;
		this.bot = bot;
	}

	async init() {
		this.canvas.addCourse("archi", "2450996");
		this.canvas.addCourse("tgh", "2516861");

		await this.bot.init();

		await this.bot.addChannel("archi", "809726204726870036");
		return Promise.resolve();
	}

	async run(periodicCheck: number = 60 * 1000) {
		await this.init();
		this.checkTimer = setInterval(this.check.bind(this), periodicCheck);
	}

	check() {
		this.verifyAndPostAnnouncements();
	}

	async verifyAndPostAnnouncements() {
		const announces = await this.canvas.getAnnouncements();
		const zoomAnnounces = announces.filter(
			({ type }) => type == AnnonceType.ZOOM
		);

		await Promise.all(
			zoomAnnounces.map(async (announce) => {
				const notExists = await this.db.isNewAnnouncement(announce.id);
				console.log(
					`announce #${announce.id} ${
						notExists ? "not exists" : "exist"
					}`
				);

				if (notExists) {
					this.bot.postAnnounce("archi", announce);
					this.db.addAnnouncement(announce);
				}
			})
		);
	}
}
