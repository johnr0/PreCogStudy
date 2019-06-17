import React, {Component} from 'react';
import {KeyToString} from '../keycodes';

class Training extends Component{
    state={
        success_count: 0,
        success_count_threshold: 20,
        success_threshold: 0.8,
        readyTime: 1,
        trainingTime: 0,
        buttonTime: 0,
        taskStart: false,
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
        var keycode= this.props.match.params.keycode;
        var keys = KeyToString(keycode)
        this.setState({'trainingTime': this.state.trainingTime + 10/1000})
        this.setState({'buttonTime': this.state.buttonTime + 10/1000})
        if(this.state.taskStart==false){
            if(this.state.trainingTime>=this.state.readyTime){
                this.setState({'trainingTime': 0, 'taskStart':true})
            }
        }else{
            if(this.state.trainingTime>=this.state.success_threshold){
                
                if(keys['keynum']==undefined){
                    this.setState({wrong:true, right:false, late:false, buttonTime: 0})
                    this.decreaseCounter();
                }else{
                    if(this.state.dangerous){
                        this.setState({wrong:true, right:false, late:false, buttonTime: 0})
                        this.decreaseCounter();
                    }else{
                        this.setState({wrong:false, right:true, late:false, buttonTime: 0})
                        this.increaseCounter();
                        this.checkNextPage()
                    }
                    
                }
                
                this.newTraining();
            }
        }
    }

    newTraining(){
        this.state.trainingTime = 0
        if(Math.random()<0.5){
            this.setState({dangerous: true, trainingTime: 0, taskStart: false})
        }else{
            this.setState({dangerous: false, trainingTime: 0, taskStart: false})
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
        if(this.state.taskStart==false){
            return;
        }
        console.log(this.state.trainingTime)
        var _this = this
        var keycode= this.props.match.params.keycode
        var keys = KeyToString(keycode)
        
        if ((event.keyCode==keycode.split("_")[0]&&event.keyCode!=16) || (event.keyCode==16&&keycode.split("_")[0]==16&&event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT)){
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
                this.newTraining();
                //this.setState({success_count:0})
            }
            
        }else if(((event.keyCode==keycode.split("_")[1]&&event.keyCode!=16)||(event.keyCode==16&&keycode.split("_")[1]==16&&event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT)) && keys['keynum']==undefined){
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
                this.newTraining();
                //this.setState({success_count:0})
            }
        }
        this.checkNextPage()
    }

    render(){
        var keys = KeyToString(this.props.match.params.keycode)
        var innerwidth = window.innerWidth*2/3;

        var timeVarWidth;

        if(this.state.taskStart){
            if(this.state.trainingTime>=this.state.success_threshold){
                timeVarWidth = '0%'
            }else{
                timeVarWidth = ((1-this.state.trainingTime/this.state.success_threshold)*100)+'%'
            }
        }else{
            if(this.state.trainingTime>=this.state.readyTime){
                timeVarWidth = '100%'
            }else{
                timeVarWidth = ((this.state.trainingTime/this.state.readyTime)*100)+'%'
            }
        }

        return (
            <div>
                <h5 className="taskHeader">Training</h5>
                <h5 className="taskHeader" style={{"display": (keys['keynum']!=undefined)?"none":"block"}}><span className="btn">Press <b>{keys['yes']}</b></span> if the screen is saying "{(keys['question']==undefined)?'Dangerous':'Movable'}", and <span className="btn red">Press <b>{keys['no']}</b></span> if it is saying "{(keys['question']==undefined)?'Not Dangerous':'Not Movable'}", within {this.state.success_threshold} seconds!</h5>
                <h5 className="taskHeader" style={{"display": (keys['keynum']==undefined)?"none":"block"}}><span className="btn">Press <b>{keys['yes']}</b></span> if the screen is saying "{(keys['question']==undefined)?'Dangerous':'Movable'}" within {this.state.success_threshold} seconds, and press nothing if it is saying "{(keys['question']==undefined)?'Not Dangerous':'Not Movable'}"!</h5>
                <div className="taskHeader" style={{ position:'relative',}}>
                    <span className="NotiBackground green" style={{visibility:(this.state.right)?'visible':'hidden', opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}></span>
                    <span className="NotiBackground red" style={{visibility:(this.state.wrong)?'visible':'hidden', opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}></span>
                    <span className="NotiBackground grey" style={{visibility:(this.state.late)?'visible':'hidden', opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}></span>
                    
                    <span className="TrainingText" style={{"display":(!this.state.taskStart)?"block":"none"}}>Ready</span>
                    <span className="TrainingText" style={{"display":(this.state.taskStart&&this.state.dangerous)?"block":"none"}}>{(keys['question']==undefined)?'Dangerous':'Movable'}</span>
                    <span className="TrainingText" style={{"display":(this.state.taskStart&&(!this.state.dangerous))?"block":"none"}}>Not {(keys['question']==undefined)?'Dangerous':'Movable'}</span>

                    <div className="taskHeader" style={{"position":"absolute", "top":"0px", "left": innerwidth.toString()+"px"}}>
                        <h1 className="taskHeader" style={{"display": (this.state.wrong)?'block':'none', color:"red", opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}>Wrong: -1</h1>
                        <h1 className="taskHeader" style={{"display": (this.state.right)?'block':'none', color:"green", opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}>Correct: +1</h1>
                        <h1 className="taskHeader" style={{"display": (this.state.late)?'block':'none', opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}>Late: +0</h1>
                    </div>
                </div> 

                <div style={{"display":"grid"}}>
                    <div className="taskButtons">
                    <span className="btn">Press <b>{keys['yes']}</b> for Yes</span>
                    <span className="btn red" style={{"display": (keys['keynum']!=undefined)?"none":"inline-block"}}>Press <b>{keys['no']}</b> for No</span>
                    </div>
                </div>
                <div className="Timer" style={{"width":innerwidth+"px"}}>
                    <div className="TimerBar" style={{"width":timeVarWidth}}></div>
                </div>
                <div className="taskHeader">Correct and quick input will result in +1 score, late or incorrect input will result in -1 score.</div>
                <div style={{"position":"relative"}}>
                <h3 className="taskHeader">Success Counter: {this.state.success_count} / {this.state.success_count_threshold}</h3>
                <div className="taskHeader" style={{"fontSize": "0.8rem"}}>(Score does not go below 0)</div>
                    
                </div>
                <div className="taskHeader">Once you collect 20 points, you will go to the tutorial phase automatically.</div>
            </div>)
    }
}

export default Training;