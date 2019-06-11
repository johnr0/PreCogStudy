import React, {Component} from 'react';
import {KeyToString} from '../keycodes';

class Training extends Component{
    state={
        success_count: 0,
        success_count_threshold: 10,
        success_threshold: 0.8,
        trainingTime: 0,
        buttonTime: 0,
        dangerous: true,
        wrong: false,
        right: false,
        late: false,
    }

    componentDidMount(){
        document.addEventListener("keydown", this.taskKeyInput.bind(this));
        setInterval(this.TimeCount.bind(this),10)
    }

    TimeCount(){
        this.setState({'trainingTime': this.state.trainingTime + 10/1000})
        this.setState({'buttonTime': this.state.buttonTime + 10/1000})
    }

    newTraining(){
        this.state.trainingTime = 0
        if(Math.random()<0.5){
            this.setState({dangerous: true})
        }else{
            this.setState({dangerous: false})
        }
    }

    increaseCounter(){
        this.setState({success_count: this.state.success_count+1})
    }
    decreaseCounter(){
        if(this.state.success_count>0)
            this.setState({success_count: this.state.success_count-1})
    }

    checkNextPage(){
        var {keycode, wid, aid, hid, sendTo} = this.props.match.params;
        var redirect_path
        if(this.state.success_count>=this.state.success_count_threshold){
            redirect_path = "/ready/"+keycode+"/tutorial1/"+wid+"/"+aid+"/"+hid+"/"+sendTo
            window.location.href=redirect_path
        }
        return

    }

    taskKeyInput(event){
        console.log(this.state.trainingTime)
        var _this = this
        var keycode= this.props.match.params.keycode
        var keys = KeyToString(keycode)
        
        if (event.keyCode==keycode.split("_")[0]){
            this.setState({"buttonTime": 0})
            if(this.state.dangerous){
                if(this.state.trainingTime<=this.state.success_threshold){
                    this.increaseCounter()
                    this.setState({right:true})
                    this.setState({late:false})
                    this.setState({wrong:false})
                }else{
                    this.setState({right:false})
                    this.setState({late:true})
                    this.setState({wrong:false})
                    //this.setState({success_count:0})
                }
                this.setState({wrong:false})
                this.newTraining()
            }else{
                this.setState({wrong:true})
                this.setState({right:false})
                this.setState({late:false})
                this.decreaseCounter()
                //this.setState({success_count:0})
            }
            
        }else if(event.keyCode==keycode.split("_")[1] && keys['keynum']==undefined){
            this.setState({"buttonTime": 0})
            if(!this.state.dangerous){
                if(this.state.trainingTime<=this.state.success_threshold){
                    this.increaseCounter()
                    this.setState({right:true})
                    this.setState({late:false})
                    this.setState({wrong:false})
                }else{
                    this.setState({right:false})
                    this.setState({late:true})
                    this.setState({wrong:false})
                    //this.setState({success_count:0})
                }
                
                this.newTraining()
            }else{
                this.setState({wrong:true})
                this.setState({right:false})
                this.setState({late:false})
                this.decreaseCounter();
                //this.setState({success_count:0})
            }
        }
        this.checkNextPage()
    }

    render(){
        var keys = KeyToString(this.props.match.params.keycode)
        var innerwidth = window.innerWidth*2/3;
        return (
            <div>
                <h5 className="taskHeader">Training</h5>
                <h5 className="taskHeader">Press the button as the screen indicate within {this.state.success_threshold} seconds!</h5>
                <h1 className="taskHeader" style={{"display":(this.state.dangerous)?"block":"none", 'fontSize':'8.4rem'}}>Dangerous</h1>
                <h1 className="taskHeader" style={{"display":(this.state.dangerous)?"none":"block", 'fontSize':'8.4rem'}}>Safe</h1>
                <div style={{"display":"grid"}}>
                    <div className="taskButtons">
                    <span className="btn">Press <b>{keys['yes']}</b> for Dangerous</span>
                    <span className="btn red" style={{"display": (keys['keynum']!=undefined)?"none":"inline-block"}}>Press <b>{keys['no']}</b> for Safe</span>
                    </div>
                </div>
                <h5 className="taskHeader">Time: 
                    <span style={{"color": (this.state.trainingTime>this.state.success_threshold)?"red":"black"}}>{this.state.trainingTime.toFixed(1)}
                    </span>
                </h5>
                <div className="taskHeader">Correct and quick input will result in +1 score, late but correct input will result in no score change, and wrong input will result in -1 score.</div>
                <div style={{"position":"relative"}}>
                <h3 className="taskHeader">Success Counter: {this.state.success_count} / {this.state.success_count_threshold}</h3>
                <div className="taskHeader" style={{"fontSize": "0.8rem"}}>(Score does not go below 0)</div>
                    <div className="taskHeader" style={{"position":"absolute", "top":"-50px", "left": innerwidth.toString()+"px"}}>
                        <h4 className="taskHeader" style={{"display": (this.state.wrong)?'block':'none', color:"red", opacity: 1-1.5*this.state.buttonTime}}>Wrong: -1</h4>
                        <h4 className="taskHeader" style={{"display": (this.state.right)?'block':'none', color:"green", opacity: 1-1.5*this.state.buttonTime}}>Correct: +1</h4>
                        <h4 className="taskHeader" style={{"display": (this.state.late)?'block':'none', opacity: 1-1.5*this.state.buttonTime}}>Late: -1</h4>
                    </div>
                </div>
                <div className="taskHeader">Once you collect 10 points, you will go to the tutorial phase automatically.</div>
            </div>)
    }
}

export default Training;