


export default class Data {


    public branch:string;
    public commit:string;
    public power:number;
    public startTime:string;
    public endTime:string;

    constructor(branch:string, commit:string, power:number, start:string, end:string) {
        this.branch = branch;
        this.commit = commit;
        this.power = power;
        this.startTime = start;
        this.endTime = end;
    }
}