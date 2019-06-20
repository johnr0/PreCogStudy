import React, {Component} from 'react';
import {KeyToString} from '../keycodes';
import { Meteor } from 'meteor/meteor';

class Training extends Component{
    state={
        success_count: 0,
        success_count_threshold: 16,
        total_rounds: 20,
        success_threshold: 0.8,
        readyTime: 3,
        trainingTime: 0,
        buttonTime: 0,
        taskStart: false,
        dangerous: true,
        wrong: false,
        right: false,
        late: false,
        trainingRounds: 1,
        trainingButtonHits: 0,
        position: 'left',
        texts: ['danger'],
        inputs: [],
        times: [], 
        positions: [],

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
                if(this.state.inputs.length<20){
                    this.state.times.push(this.state.trainingTime)
                    this.state.inputs.push('late')
                
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
                            //this.checkNextPage()
                        }
                        
                    }
                    
                    this.checkNextPage();
                }
                
            }
        }
    }

    newTraining(){
        this.state.trainingTime = 0
        this.setState({trainingRounds: this.state.trainingRounds+1})
        if(Math.random()<0.5){
            this.setState({dangerous: true, trainingTime: 0, taskStart: false})
            this.state.texts.push('danger')
        }else{
            this.setState({dangerous: false, trainingTime: 0, taskStart: false})
            this.state.texts.push('safe')
        }
        if(Math.random()<0.5){
            this.setState({position: 'left'})
            this.state.positions.push('left')
        }else{
            this.setState({position:'right'})
            this.state.positions.push('right')
        }
    }

    increaseCounter(){
        this.setState({success_count: this.state.success_count+1})
    }
    decreaseCounter(){
        //if(this.state.success_count>0)
            //this.setState({success_count: this.state.success_count-1})
    }

    checkNextPage(){
        
        if(this.state.trainingRounds>=this.state.total_rounds){
            // record the results
            var {keycode, wid, aid, hid, sendTo} = this.props.match.params;
            Meteor.call('worker.trainingend', wid, aid, hid, this.state.texts, this.state.inputs, this.state.times, this.state.positions);
            var redirect_path
            if(this.state.success_count>=this.state.success_count_threshold){
                redirect_path = "/ready/"+keycode+"/tutorial1/"+wid+"/"+aid+"/"+hid+"/"+sendTo
                window.location.href=redirect_path
                return
            }else{
                // do the task again
                redirect_path = "/ready/"+keycode+"/trainingRe/"+wid+"/"+aid+"/"+hid+"/"+sendTo
                window.location.href=redirect_path

            }
            
        }
        this.newTraining();
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
            this.setState({"buttonTime": 0, "trainingButtonHits": this.state.trainingButtonHits+1})
            this.state.inputs.push(true)
            this.state.times.push(this.state.trainingTime)
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
                //this.newTraining()
            }else{
                this.setState({wrong:true})
                this.setState({right:false})
                this.setState({late:false})
                this.decreaseCounter()
                
                //this.setState({success_count:0})
            }
            this.checkNextPage()
        }else if(((event.keyCode==keycode.split("_")[1]&&event.keyCode!=16)||(event.keyCode==16&&keycode.split("_")[1]==16&&event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT)) && keys['keynum']==undefined){
            this.setState({"buttonTime": 0, "trainingButtonHits": this.state.trainingButtonHits+1})
            this.state.inputs.push(false)
            this.state.times.push(this.state.trainingTime)
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
                
               // this.newTraining()
            }else{
                this.setState({wrong:true})
                this.setState({right:false})
                this.setState({late:false})
                this.decreaseCounter();
                
                //this.setState({success_count:0})
            }
            this.checkNextPage()
        }
        
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
                <h5 className="taskHeader" style={{"display": (keys['keynum']!=undefined)?"none":"block"}}><span className="btn">Press <b>{keys['yes']}</b></span> if the screen is saying "{(keys['question']==undefined)?'Dangerous':'Movable'}", and <span className="btn red">Press <b>{keys['no']}</b></span> if it is saying "{(keys['question']==undefined)?'Not Dangerous':"Won't move"}", within {this.state.success_threshold} seconds!</h5>
                <h5 className="taskHeader" style={{"display": (keys['keynum']==undefined)?"none":"block"}}><span className="btn">Press <b>{keys['yes']}</b></span> if the screen is saying "{(keys['question']==undefined)?'Dangerous':'Movable'}" within {this.state.success_threshold} seconds, and press nothing if it is saying "{(keys['question']==undefined)?'Not Dangerous':"Won't move"}"!</h5>
                <div className="taskHeader" style={{ position:'relative',}}>
                    <div style={{height:'350px'}}>
                        <span className="NotiBackground green" style={{visibility:(this.state.right)?'visible':'hidden', opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}></span>
                        <span className="NotiBackground red" style={{visibility:(this.state.wrong)?'visible':'hidden', opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}></span>
                        <span className="NotiBackground grey" style={{visibility:(this.state.late)?'visible':'hidden', opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}></span>
                        
                        <span className="TrainingText" style={{"display":(this.state.taskStart&&this.state.dangerous)?"block":"none", 
                        paddingLeft: (this.state.position=='left')?'0px':'200px', paddingRight: (this.state.position=='right')?'0px':'200px'}}>
                        {(keys['question']==undefined)?'Dangerous':'Movable'}</span>
                        <span className="TrainingText" style={{"display":(this.state.taskStart&&(!this.state.dangerous))?"block":"none", 
                        paddingLeft: (this.state.position=='left')?'0px':'200px', paddingRight: (this.state.position=='right')?'0px':'200px'}}>
                        {(keys['question']==undefined)?'Not Dangerous':"Won't move"}</span>

                        <div className="TrainingBlind" style={{display:(this.state.taskStart)?'none':'block'}}>
                            <div className="TaskBlindText">
                                <span>The text will be shown soon!</span>
                            </div>
                            <div className="preloader-wrapper big active" style={{position: 'relative', top:'0%'}}>
                                <div className="spinner-layer spinner-blue-only">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div><div className="gap-patch">
                                    <div className="circle"></div>
                                </div><div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className="taskHeader" style={{"position":"absolute", "top":"0px", "left": innerwidth.toString()+"px"}}>
                            <h1 className="taskHeader" style={{"display": (this.state.wrong)?'block':'none', color:"red", opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}>Wrong</h1>
                            <h1 className="taskHeader" style={{"display": (this.state.right)?'block':'none', color:"green", opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}>Correct: +1</h1>
                            <h1 className="taskHeader" style={{"display": (this.state.late)?'block':'none', opacity: (this.state.buttonTime*1.5<1)?1-1.5*this.state.buttonTime : 0}}>Late</h1>
                        </div>
                    </div>
                </div> 

                <div style={{"display":"grid"}}>
                    <div className="taskButtons">
                    <span className="btn">Press <b>{keys['yes']}</b> for Yes</span>
                    <span className="btn red" style={{"display": (keys['keynum']!=undefined)?"none":"inline-block"}}>Press <b>{keys['no']}</b> for No</span>
                    </div>
                </div>
                <div className="taskHeader">Correct and quick input will result in +1 score.</div>
                <div style={{"position":"relative"}}>
                <h3 className="taskHeader">Success Counter: {this.state.success_count} / {this.state.total_rounds} (Currently {this.state.trainingRounds-1} round(s) done )</h3>
                    
                </div>
            </div>)
    }
}

export default Training;