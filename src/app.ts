import IApp from "./models/iapp";
import IBot from "./models/ibot";
import ICanvas from "./models/icanvas";
import IFirestore from "./models/ifirestore";
import { AnnonceType } from "./models/types";
import { extractTimeFromText } from "./utils";

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

	async run(periodicCheck: number = 10 * 1000) {
		await this.init();
		this.checkTimer = setInterval(this.check.bind(this), periodicCheck);
	}

	async init() {
		this.canvas.addCourse("archi", "2450996");
		this.canvas.addCourse("thg", "2516861");

		await this.bot.init();

		await this.bot.addChannel("thg", "809893163480776724");
		await this.bot.addChannel("archi", "809893163480776724");
		return Promise.resolve();
	}

	check() {
		this.verifyAndPostAnnouncements();
		this.deleteExpiredPins();
	}

	async deleteExpiredPins() {
		const pins = await this.db.deleteExpiredPins();
		pins.forEach(({ id, module }) => {
			this.bot.unpin(id, module, true);
		});
	}

	async verifyAndPostAnnouncements() {
		const announces = await this.canvas.getAnnouncements();

		announces.forEach(async (announce) => {
			const notExists = await this.db.isNewAnnouncement(announce.id);
			console.log(
				`announce #${announce.id} ${notExists ? "not exists" : "exist"}`
			);

			if (notExists) {
				const isZoom = announce.type == AnnonceType.ZOOM;
				if (isZoom) {
					const prevAnnounces = await this.db.unpin(
						"module",
						announce.module
					);
					await Promise.all(
						prevAnnounces.map(({ id }) =>
							this.bot.unpin(id, announce.module, true)
						)
					);
				}

				const postId = await this.bot.postAnnounce(
					announce.module,
					announce,
					isZoom
				);

				await this.db.addAnnouncement(announce);

				const time =
					extractTimeFromText(announce.message) ||
					1000 * 60 * 60 * 24 * 2;

				if (isZoom) {
					await this.db.pin(postId, announce.module, time);
				}
			}
		});
	}
}
