import discord, { MessageOptions } from "discord.js";
import { Announcement } from "./types";

export default interface IBot {
	addChannel: (name: string, id: string) => void;

	postToChannel: (
		channel: string,
		message: string,
		options?: MessageOptions
	) => Promise<discord.Message>;

	postAnnounce: (
		channelName: string,
		announce: Announcement,
		pin?: boolean
	) => Promise<string>;

	unpin: (id: string, channelName: string, remove?: boolean) => Promise<void>;

	init: () => Promise<void>;
}
