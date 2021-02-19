import IBot from "./models/ibot";

export default class Bot implements IBot{
    token: string;
    channels: { name: string; id: number; }[];

    constructor(token:string){
        this.token = token;
        this.channels=[];
    }
    
    addChannel (name: string, id: number){
        this.channels.push({
            name,id
        });
    };

    postToChannel(channel: string, content: string){
        console.log(`posting ${content} to ${channel}`);

        return Promise.resolve();
    };

}