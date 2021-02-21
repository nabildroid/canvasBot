import discord, { MessageOptions } from "discord.js";
import { Announcement } from "./types";

export default interface IBot {
	addChannel: (name: string, id: string) => void;

	postToChannel: (
		channel: string,
		message: string,
		options?: MessageOptions
	) => Promise<void>;

	postAnnounce: (
		channelName: string,
		announce: Announcement
    ) => Promise<void>;
    
	init: () => Promise<void>;
}
