import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Task from './task'
import { Meteor } from 'meteor/meteor';
import { Videos, Annotations } from '../../../imports/collections/data';

class TaskWrapper extends Component{

    taskDone(answer){
        const {keycode, videoname, wid, aid, hid, sendTo} = this.props.match.params
        var tut = this.props.match.params.videoname
        console.log(tut)
        var confirm_message = ''
        if(tut.includes('tutorial')){
            var correct_answer = 'yes'
            if (tut=="tutorial1"){
                correct_answer='yes'
            }else if (tut=="tutorial2"){
                correct_answer='no'
            }
            
            if(correct_answer=='yes'){
                if(correct_answer==answer){
                    confirm_message = "Correct! Because the human could have move into your lane, the human could have caused a catastrophic accident."
                }else if(answer=='no'){
                    confirm_message = "You didn't get it correct. Because the human could have move into your lane, the human could have caused a catastrophic accident. Please keep the goal in your mind!"
                }else if(answer=='late'){
                    confirm_message = "You should have answered early! Also, because the human could have move into your lane, it could have caused a catastrophic accident. Please keep the goal in your mind!"
                }
            }else if(correct_answer=='no'){
                if(correct_answer==answer){
                    confirm_message = "Correct! Because the streetlight cannot move into your lane, it cannot harm your vehicle."
                }else if(answer=='yes'){
                    confirm_message = "You didn't get it correct. Because the streetlight cannot move into your lane, it cannot harm your vehicle. Please keep the goal in your mind!"
                }else if(answer=='late'){
                    confirm_message = "You should have answered early! Also, because the streetlight cannot move into your lane, it cannot harm your vehicle. Please keep the goal in your mind!"
                }
            }
        }else{
            if(answer!='late'){
                confirm_message='Completed the task! Moving to the next page.'
            }else{
                confirm_message='You should have answered earlier! However, your result would not affect your payment, so do not worry.'
            }        
        }

        var redirect_path = "/ready/"+keycode+"/tutorial2"

        if(tut=="tutorial1"){
            redirect_path="/ready/"+keycode+"/tutorial2"
        }else if(tut=="tutorial2"){
            redirect_path="/ready/"+keycode+"/task2"
        }else if(tut=="task2"){
            redirect_path="/ready/"+keycode+"/task3"
        }else if(tut=="task3"){
            redirect_path="/submit/"+keycode
        }
        redirect_path = redirect_path+"/"+wid+"/"+aid+"/"+hid+"/"+sendTo
        
        alert(confirm_message)
        window.location.href=redirect_path
        
    }

    render(){
        console.log(this.props.aanno)
        if(this.props.avideo.length>0){
            return (
                <div>
                    <Task taskDone={this.taskDone.bind(this)} 
                    keycode={this.props.match.params.keycode}
                    videoUrl={this.props.avideo[0].url}
                    wid={this.props.match.params.wid} aid={this.props.match.params.wid}
                    hid={this.props.match.params.wid} 
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
    Meteor.subscribe('a-video', videoname)
    return {
        avideo: Videos.find().fetch(),
    }
}, TaskWrapper);