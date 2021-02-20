import IBot from "./ibot";
import ICanvas from "./icanvas";
import IFirestore from "./ifirestore";

export default interface IApp {
	db: IFirestore;
	canvas: ICanvas;
	bot: IBot;
	checkTimer?: NodeJS.Timeout;

	run: (periodicCheck: number) => void;
	check: () => void;
	init: () => Promise<void>;
}
