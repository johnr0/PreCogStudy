import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Task from './task'
import { Meteor } from 'meteor/meteor';
import { Videos, Annotations, Workers } from '../../../imports/collections/data';
import { KeyToString } from '../keycodes';
class TaskWrapper extends Component{

    state={
        started: false,
    }

    taskDone(answer){
        const {keycode, videoname, wid, aid, hid, sendTo} = this.props.match.params
        var keys = KeyToString(keycode)
        var tut = this.props.match.params.videoname
        console.log(tut)
        var confirm_message = ''
        var tut_add = ''
        if(tut.includes('tutorial')){
            var correct_answer = 'yes'
            if (tut=="tutorial1"){
                correct_answer='yes'
            }else if (tut=="tutorial2"){
                correct_answer='no'
            }
            
            if(correct_answer=='yes'){
                if(correct_answer==answer){
                    tut_add='correct'
                    confirm_message = "Correct, because the human could have move into your lane."
                }else if(answer=='no'){
                    tut_add='wrong'
                    confirm_message = "You didn't get it correct, because the human could have move into your lane. Please keep the goal in your mind!"
                }else if(answer=='late'){
                    tut_add='late'
                    confirm_message = "You should have answered early! Also, the human could have move into your lane. Please keep the goal in your mind!"
                }
            }else if(correct_answer=='no'){
                if(correct_answer==answer){
                    tut_add='correct'
                    confirm_message = "Correct, because the object cannot move into your lane!"
                }else if(answer=='yes'){
                    tut_add='wrong'
                    confirm_message = "You didn't get it correct, because the object cannot move into your lane. Please keep the goal in your mind!"
                }else if(answer=='late'){
                    tut_add='late'
                    if (keys['keynum']!=undefined){
                        confirm_message = "Correct, because the object cannot move into your lane!"
                    }else{
                        confirm_message = "You should have answered early! Also, the object cannot move into your lane. Please keep the goal in your mind!"
                    }   
                }
            }
        }else{
            if(answer!='late'){
                confirm_message='Completed the task! Moving to the next page.'
            }else{
                if (keys['keynum']!=undefined){
                    confirm_message='Completed the task! Moving to the next page.'
                }else{
                    confirm_message='You should have answered earlier! However, your result would not affect your payment, so do not worry.'
                }
                
            }        
        }

        var redirect_path = "/ready/"+keycode+"/tutorial2"

        if(tut=="tutorial1"){
            redirect_path="/ready/"+keycode+"/tutorial2_"+tut_add
        }else if(tut=="tutorial2"){
            redirect_path="/ready/"+keycode+"/0_"+tut_add
        }else if(tut!='9'){
            
            redirect_path="/task/"+keycode+"/"+(parseInt(videoname)+1).toString()
        }else{
            redirect_path ="/submit/"+keycode
        }
        redirect_path = redirect_path+"/"+wid+"/"+aid+"/"+hid+"/"+sendTo
        
        //alert(confirm_message)
        // update the current task number
        window.location.href=redirect_path
        if(!tut.includes('tut')){
            Meteor.call('worker.nextTask', wid, aid, hid)
        }
        
        
        
    }

    render(){
        console.log(this.props.aworker)
        var vdname = this.props.match.params.videoname
        if(!vdname.includes('tut')){
            if(this.props.aworker!=undefined){
                if(this.props.aworker.cur_task != parseInt(vdname)){
                    if(this.state.started==false){
                        //alert("You cannot rewatch the video. You will be redirected to the video you should work on.")
                        const {keycode, videoname, wid, aid, hid, sendTo} = this.props.match.params
                        if(this.props.aworker.cur_task!='10'){
                            var redirect_path = "/task/"+keycode+"/"+(parseInt(this.props.aworker.cur_task)).toString()+"/"+wid+"/"+aid+"/"+hid+"/"+sendTo
                            window.location.href=redirect_path
                        }else{
                            var redirect_path = "/submit/"+keycode
                            window.location.href=redirect_path+"/"+wid+"/"+aid+"/"+hid+"/"+sendTo
                        }
                    }
                    
                }else if(this.state.started==false){
                    const {keycode, videoname, wid, aid, hid, sendTo} = this.props.match.params
                    this.setState({started:true});
                    Meteor.call('annotation.startTask', wid, aid, hid, this.props.avideo[0]._id, sendTo, keycode)
                }
            }
        }else if(this.props.aworker!=undefined){
            if(this.state.started==false){
                const {keycode, videoname, wid, aid, hid, sendTo} = this.props.match.params
                this.setState({started:true});
                Meteor.call('annotation.startTask', wid, aid, hid, this.props.avideo[0]._id, sendTo, keycode)
            }
        }

        
        if(this.props.avideo.length>0){
            return (
                <div>
                    <Task taskDone={this.taskDone.bind(this)} 
                    keycode={this.props.match.params.keycode}
                    videoUrl={this.props.avideo[0].url}
                    wid={this.props.match.params.wid} aid={this.props.match.params.aid}
                    hid={this.props.match.params.hid} 
                    sendTo={this.props.match.params.sendTo}
                    videoid={this.props.avideo[0]._id}
                    videoname={this.props.avideo[0].name}></Task>
                </div>
            )
        }else{
            return (<div></div>)
        }
        
    }
}

export default createContainer((props) => {
    var videoname = props.match.params.videoname;
    var wid = props.match.params.wid
    var aid = props.match.params.aid
    Meteor.subscribe('a-video', videoname, wid)
    Meteor.subscribe('a-worker', wid)
    return {
        aworker: Workers.find().fetch()[0],
        avideo: Videos.find().fetch(),
    }
}, TaskWrapper);