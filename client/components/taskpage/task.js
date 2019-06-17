import React, {Component} from 'react';
import Player from './player'
import { Meteor } from 'meteor/meteor';
import { KeyToString } from '../keycodes'

class Task extends Component{
    state={
        videoLoaded:false,
        videoStarted:false,
        pageTime: 0,
        videoTime: 0,
    }

    componentDidMount(){
        
        setInterval(this.TimeCount.bind(this),10)
        
    }

    videoisLoaded(){
        this.setState({videoLoaded:true})
    }

    addKeyListener(){
        document.addEventListener("keydown", this.taskKeyInput.bind(this));
        this.setState({videoStarted:true})
    }

    TimeCount(){
        this.state.pageTime += 10/1000
    }

    taskKeyInput(event){
        var _this = this
        var keys = KeyToString(this.props.keycode)
        if ((event.keyCode==this.props.keycode.split("_")[0]&&event.keyCode!=16) || (event.keyCode==16&&this.props.keycode.split("_")[0]==16&&event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT)){
            var vt = this.refs.player.getVideoTime().then(result => {
                console.log(result)
                // log video duration time at here
                Meteor.call('annotation.videoduration', this.props.wid, this.props.aid, this.props.hid, this.props.videoid, 
                    result, this.props.keycode)
            })
            // log task page duration time at here, and also record finish time
            Meteor.call('annotation.annotate', this.props.wid, this.props.aid, this.props.hid, this.props.videoid, 
                this.state.pageTime, true, this.props.keycode)
            this.refs.player.player.pause().then(function(){
                _this.props.taskDone('yes')
                
            })
            console.log("Yes", this.state.pageTime)
        }else if(((event.keyCode==this.props.keycode.split("_")[1]&&event.keyCode!=16)||(event.keyCode==16&&this.props.keycode.split("_")[1]==16&&event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT)) && keys['keynum']==undefined){
            var vt = this.refs.player.getVideoTime().then(result => {
                console.log(result)
                // log video duration time at here
                Meteor.call('annotation.videoduration', this.props.wid, this.props.aid, this.props.hid, this.props.videoid, 
                    result, this.props.keycode)
            })
            // log task page duration time at here, and also record finish time
            Meteor.call('annotation.annotate', this.props.wid, this.props.aid, this.props.hid, this.props.videoid, 
                this.state.pageTime, false, this.props.keycode)
            this.refs.player.player.pause().then(function(){
                _this.props.taskDone('no')
            })
            
            console.log("No", this.state.pageTime)
        }
    }

    lateTask(){
        this.props.taskDone('late')
        this.refs.player.getVideoTime().then(result => {
            console.log(result)
            // log video duration time at here
            Meteor.call('annotation.videoduration', this.props.wid, this.props.aid, this.props.hid, this.props.videoid, 
                result, this.props.keycode)
        })
        Meteor.call('annotation.annotate', this.props.wid, this.props.aid, this.props.hid, this.props.videoid, 
            this.state.pageTime, 'late', this.props.keycode)
        
    }

    render(){
        var keys = KeyToString(this.props.keycode)
        return (
            <div>
                
                <h5 className="taskHeader">Complete the task ASAP!</h5>
                <div style={{"position":"relative"}}>
                    <div className="TaskBlind" style={{display:(this.state.videoStarted)?'none':'block'}}>
                        <span className="TaskBlindText" style={{display:(this.state.videoLoaded)?'none':'block'}}>Please wait... the video is being loaded.</span>
                        <span className="TaskBlindText" style={{display:(this.state.videoLoaded)?'block':'none'}}>Video loaded. The task will start soon!</span>
                    </div>
                    <Player videoUrl={this.props.videoUrl} lateTask={this.lateTask.bind(this)} addKeyListener={this.addKeyListener.bind(this)} 
                    videoisLoaded={this.videoisLoaded.bind(this)} ref="player">

                    </Player>
                </div>
                <h6 className="taskHeader">Can an object in a green box {(keys['question']==undefined)?'cause an accident to our vehicle?':'move close to our vehicle?'}</h6>
                <div style={{"display":"grid"}}>
                    <div className="taskButtons">
                    <span className="btn">Press <b>{keys['yes']}</b> for Yes</span>
                    <span className="btn red" style={{"display": (keys['keynum']!=undefined)?"none":"inline-block"}}>Press <b>{keys['no']}</b> for No</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Task;