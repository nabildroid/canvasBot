import IBot from "./models/ibot";
import discord from "discord.js";
import { Announcement, Mention } from "./models/types";

export default class Bot implements IBot {
	server: discord.Client;
	channels: { [key: string]: discord.TextChannel };

	constructor(token: string) {
		this.channels = {};

		this.server = new discord.Client();
		this.server.login(token);
	}

	async initIvents() {
		await new Promise<void>((res) => {
			this.server.on("ready", () => {
				this.onReady();
				res();
			});
		});
	}

	onReady() {
		console.log(this.server.user?.username + " is ready");
	}

	async addChannel(name: string, id: string) {
		const channel = await this.server.channels.fetch(id);
		if (!channel || channel.type != "text") {
			throw Error(`${name} is not a text channel`);
		} else {
			this.channels[name] = channel as discord.TextChannel;
		}
	}

	async postToChannel(channelName: string, announce: Announcement) {
		if (!this.channels[channelName])
			throw Error(`please add ${channelName} to the bot object`);

		const channel = this.channels[channelName];
		const embed = new discord.MessageEmbed();
		embed.setAuthor(announce.author);
		embed.setTitle(announce.title);
		embed.setTimestamp(announce.date);
		embed.setFooter(announce.module);
		embed.setDescription(announce.message);

		const mentions = this.getMentions(announce.message).reduce((acc,v)=>acc + " " + v,"");
		channel.send(mentions, embed);

		return Promise.resolve();
	}

	getMentions(text: string): Mention[] {
		const mentions: Mention[] = [];
		const find: { [key in Mention]: string[] } = {
			[Mention.GRP1]:["group1","group 1","g1","g 1","grp1"],
			[Mention.GRP2]:["group2","group 2","g2","g 2","grp2"],
			[Mention.GRP3]:["group3","group 3","g3","g 3","grp3"],
			[Mention.GRP4]:["group4","group 4","g4","g 4","grp4"],
			[Mention.ALL]:[]
		};

		Object.entries(find).forEach(([k,v])=>{
			v.findIndex((val)=>{
				if(text.includes(val)){
					mentions.push(k as unknown as Mention);
					return true;
				}
			})
		})

		if(!mentions.length)
			mentions.push(Mention.ALL);

		return mentions;
	}
}
