import discord from "discord.js";
import { Announcement } from "./types";

export default interface IBot {
    channels: { [key: string]: discord.TextChannel };
    
	server: discord.Client;

	addChannel: (name: string, id: string) => void;

    postToChannel: (channel: string, announce: Announcement) => Promise<void>;
    initIvents:()=>Promise<void>;
    
}
