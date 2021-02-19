import IApp from "./models/iapp";
import IBot from "./models/ibot";
import ICanvas from "./models/icanvas";
import IFirestore from "./models/ifirestore";

export default class App implements IApp {
	db: IFirestore;
	canvas: ICanvas;
	checkTimer?: NodeJS.Timeout;
	bot: IBot;

	constructor(
		db: IFirestore,
		canvas: ICanvas,
		bot: IBot,
		periodicCheck = 10 * 1000
	) {
		this.db = db;
		this.canvas = canvas;
        this.bot = bot;

		this.init().then(() => {
			this.checkTimer = setInterval(this.check.bind(this), periodicCheck);
		});
	}

	async init() {
		this.canvas.addCourse("archi", "2450996");
		this.canvas.addCourse("tgh", "2516861");

        this.bot.addChannel("thg-zoom",155112);
        this.bot.addChannel("archi-zoom",152112);
        this.bot.addChannel("general",155223);

		return Promise.resolve();
	}

	run() {}

	check() {
        this.canvas.getCourseAnnouncements("archi").then(announcements=>{
            announcements.forEach(announce=>{
                if(this.db.isNewAnnouncement(announce.id)){
                    this.bot.postToChannel("archi-zoom",announce.message);
                    this.db.addAnnouncement(announce);
                }
            })
        })
	}
}
