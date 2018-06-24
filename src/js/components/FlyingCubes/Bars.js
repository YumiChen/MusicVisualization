import React, {Component} from "react";

export default class Bars extends Component{
    constructor(props){
        super(props);

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.barNum = 100;
        this.barWidth = this.width/(this.barNum);
        this.barX = 0;
        this.barsOpacity = 0;
    }
    componentDidMount=()=>{
        window.addEventListener('resize', this.onResize);
        this.ctx=this.canvas.getContext('2d');
           
        this.canvas.width= this.width;
        this.canvas.height= this.height;
    }
    render(){
        return (<canvas ref={canvas=>(this.canvas=canvas)}/>);
    }
    componentDidUpdate(prevProps){
        if(this.props.fbcArray && this.props.fbcArray !== prevProps.fbcArray){
            this.drawBars(this.props.fbcArray);
        }
    }
    drawBars=fbcArray=>{
        const ctx = this.ctx,
              barWidth = this.barWidth,
              barNum = this.barNum;

        ctx.clearRect(0,0,this.width,this.height);
        ctx.fillStyle = 'rgba(255,255,255,'+ this.barsOpacity +')';
          
        if(this.barsOpacity < 0.5){
            this.barsOpacity += 0.003;
        }
        
        for(let l=0;l<barNum;l+=1){
            var Barheight = -(fbcArray[l]/2.5);
            ctx.fillRect(this.barX+(l*barWidth),this.canvas.height,barWidth,Barheight);
            ctx.fill();
            
            ctx.fillRect(window.innerWidth-((l+1)*barWidth),0,barWidth,-Barheight);
            ctx.fill();
        }
    }
    onResize=()=>{
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.barWidth = this.width/(this.barNum);
        this.ctx.clearRect(0,0,this.width,this.height);
    }
}


