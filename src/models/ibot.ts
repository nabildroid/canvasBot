export default interface IBot {
	token: string;
    channels: { name: string; id: number }[];
    
    addChannel:(name:string,id:number)=>void;

    postToChannel:(channel:string,content:string)=>Promise<void>;

    
}
