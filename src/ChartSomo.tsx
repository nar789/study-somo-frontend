import Data from "./Data";




export default class ChartSomo {
    public info:any;

    constructor(list : Array<Data>) {
        const label:Array<string> = new Array<string>();
        const value:Array<number> = new Array<number>();

        list.map(data => {
            label.push(data.commit); 
            value.push(data.power);
            return data;
        });

        this.info = {
            labels: label,
            datasets: [
              {
                label: "RPM",
                fill: true,
                lineTension: 0.3,
                backgroundColor: "rgba(184, 185, 210, 0.3)",
                borderColor: "rgb(35, 26, 136)",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgb(35, 26, 136)",
                pointBackgroundColor: "rgb(255, 255, 255)",
                pointBorderWidth: 10,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(0, 0, 0)",
                pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: value
              }
            ]
          };

    }
}