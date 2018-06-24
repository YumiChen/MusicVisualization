import React, {Component} from "react";
import Cubes from './Cubes';
import Bars from './Bars';

export default class FlyingCubes extends Component{
    constructor(props){
        super(props);
        
        this.vals = [];
        this.state = {
            fbcArray: null,
            scaleVal: null,
            ended: false,
            started: false
        };
    }
    componentDidMount(){
        this.initAudio();
        this.sound.addEventListener('ended', this.onEnded);
    }
    render(){
        return (<div>
            {!this.state.started && <div className='FlyingCubes-UIContainer'>
                <div className='FlyingCubes-frame'/>
                <label for='audioInput' className='FlyingCubes-upload-btn'>UPLOAD</label>
            </div>}
            <input type='file' id='audioInput' onChange={this.handleUpload}/>
            <audio ref={sound=>(this.sound=sound)} id='audio'/>
            {this.state.ended && <button onClick={this.refresh} className='FlyingCubes-refresh-btn'>REFRESH</button>}
            <Cubes val={this.state.scaleVal}/>    
            <Bars fbcArray={this.state.fbcArray}/>
        </div>);
    }
    initAudio(){
        // init AudioContext
        this.context = new AudioContext();
        this.source = this.context.createMediaElementSource(this.sound);
        this.gainNode = this.context.createGain();
        this.analyser = this.context.createAnalyser();
        // connect
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.context.destination); 
        
        this.gainNode.gain.value = 2;
      }
    handleUpload=e=>{
        this.setState({started: true});
        this.sound.src = URL.createObjectURL(e.target.files[0]);
        this.sound.play();

        window.requestAnimationFrame(this.frameLooper);
    }
    frameLooper=()=>{
        if (this.scaleAniId) {
            window.cancelAnimationFrame(this.scaleAniId);
            this.scaleAniId = undefined;
        }

        var fbcArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(fbcArray);
        
        var scaleVal = this.getVals(fbcArray)/3;

        this.setState({
            fbcArray,
            scaleVal
        });
      
        if(this.state.ended){
             this.setState({
                fbcArray: null,
                scaleVal: null
            });
        }
        else this.scaleAniId = window.requestAnimationFrame(this.frameLooper)
    } 
    onEnded=()=>{
        URL.revokeObjectURL(this.sound.src);
        this.setState({
            ended: true
        });
    }
    refresh=()=>{
        location.reload();
    }
    getVals=fbcArray=>{
        var ave = this.getAverage(fbcArray);
        
        if(typeof this.vals[0] !== 'number'){
          this.vals[0] = ave;
          return;
        }else this.vals[1]=ave;

        var differance = Math.abs(this.vals[0]-this.vals[1]);
        this.vals[0] = this.vals[1];
        delete this.vals[1];
        return differance;
    }
    getAverage=(arr)=>{
        var sum = 0,result;
        arr.forEach(function(arr){
            sum+=arr;
        });
          result = sum/arr.length;
        return result;
    }
}