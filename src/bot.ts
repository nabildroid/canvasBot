import IBot from "./models/ibot";
import discord, { MessageOptions } from "discord.js";
import { AnnonceType, Announcement, Mention } from "./models/types";

export default class Bot implements IBot {
	server: discord.Client;
	channels: { [channelName: string]: discord.TextChannel };

	constructor(token: string) {
		this.channels = {};

		this.server = new discord.Client();
		this.server.login(token);
	}

	async init() {
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

	async postAnnounce(
		channelName: string,
		announce: Announcement,
		pin = false
	) {
		const embed = this.createEmbedAnnounce(announce);
		if (announce.type == AnnonceType.ZOOM) {
			embed.setColor("#0099ff");
			embed.setThumbnail(
				"https://www.algonquincollege.com/corporate/files/2020/06/zoom-logo.png"
			);
		}

		const mentions = this.getMentions(
			announce.message + announce.title
		).reduce((acc, v) => acc + " " + v, "");

		const message = await this.postToChannel(channelName, mentions, {
			embed,
		});

		if (pin) await message.pin();

		return message.id;
	}

	async postToChannel(
		channelName: string,
		message: string,
		options: MessageOptions = {}
	) {
		const channel = this.getChannel(channelName);

		const sentMessage = await channel.send(message, options);
		return sentMessage as discord.Message;
	}

	async unpin(id: string, channelName: string, remove = false) {
		const channel = this.getChannel(channelName);
		const message = await channel.messages.fetch(id);
		await message.unpin();

		if (remove) await message.delete();
	}

	getChannel(channelName: string) {
		if (!this.channels[channelName])
			throw Error(`please add ${channelName} to the bot object`);

		return this.channels[channelName];
	}

	createEmbedAnnounce(announce: Announcement) {
		const embed = new discord.MessageEmbed();
		embed.setAuthor(announce.author);
		embed.setTitle(announce.title);
		embed.setTimestamp(announce.date);
		embed.setFooter(announce.module);
		embed.setDescription(announce.message);
		return embed;
	}

	getMentions(text: string): Mention[] {
		const mentions: Mention[] = [];
		const find: { [key in Mention]: string[] } = {
			[Mention.GRP1]: [
				"group1",
				"group 1",
				"g1",
				"g 1",
				"g01",
				"g 01",
				"gr 1",
				"grp1",
				"grp 1",
				"grp01",
				"grp 01",
			],
			[Mention.GRP2]: [
				"group2",
				"group 2",
				"g2",
				"g 2",
				"g02",
				"g 02",
				"gr 2",
				"grp2",
				"grp 2",
				"grp02",
				"grp 02",
			],
			[Mention.GRP3]: [
				"group3",
				"group 3",
				"g3",
				"g 3",
				"g03",
				"g 03",
				"gr 3",
				"grp3",
				"grp 3",
				"grp03",
				"grp 03",
			],
			[Mention.GRP4]: [
				"group4",
				"group 4",
				"g4",
				"g 4",
				"g04",
				"g 04",
				"gr 4",
				"grp4",
				"grp 4",
				"grp04",
				"grp 04",
			],
			[Mention.ALL]: [],
		};

		Object.entries(find).forEach(([k, v]) => {
			v.findIndex((val) => {
				if (text.toLowerCase().includes(val)) {
					mentions.push((k as unknown) as Mention);
					return true;
				}
			});
		});

		if (!mentions.length) mentions.push(Mention.ALL);

		return mentions;
	}
}
