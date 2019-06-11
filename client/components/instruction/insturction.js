import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Gup from '../mturk/gup';
import { KeyToString } from '../keycodes'
import { Meteor } from 'meteor/meteor';
import {Annotations} from '../../../imports/collections/data'

class Instruction extends Component{

    toTutorial(){
        
        const {keycode} = this.props.match.params
        var keys = KeyToString(keycode)
        if(keys['training']==undefined){
            window.location.href = "/ready/"+keycode+"/tutorial1/"+Gup('workerId')+"/"+Gup('assignmentId')+"/"+Gup('hitId')+"/"+Gup('turkSubmitTo')
        }else{
            window.location.href = "/training/"+keycode+"/"+Gup('workerId')+"/"+Gup('assignmentId')+"/"+Gup('hitId')+"/"+Gup('turkSubmitTo')
        }
        
    }

    render(){
        var aid = Gup('assignmentId')
        console.log(aid)
        var task_availability=false;
        if(aid!="" && aid!="ASSIGNMENT_ID_NOT_AVAILABLE"){
            task_availability=true;
        }

        var keycode = this.props.match.params.keycode
        // left: 37 / right: 39/ up: 38
        // K:75 / M:77 /Z: 90 / 
        // E: 69 / I: 73 / Space: 32 / two hands: 2
        // Space: 32 / Q: 81 / Up: 38 / X / one key: 1 (32_81_38__1)
        // left: 37 / right: 39 / up: 38 / X / X / training: t (37_39_38___t)
        // E: 69 / I: 73 / Space: 32 / two hands: 2 / X / training: t (69_73_32_2__t)

        var keys = KeyToString(keycode)
        console.log(keys)

        if(this.props.workerAnnotations.length==0){
            return (
                <div>
                    <h4>The goal of task is to discern whether an object 'can' be dangerous to our vehicle in near future.</h4>
                    <p>You will watch a short 1st point-of-view video of car driving down a road.</p>
                    <p>In the video, you will see an object that is marked with <span style={{"color":"green"}}>green box</span>.</p>
                    <p><b>As soon as possible</b>, You should decide whether the object can jump into the lane and <b>cause a car accident</b>.</p>
                    <p style={{"display": (keys['keynum']!=undefined)?"none":"block"}}>Remember two things! First, You should do it <b>as fast as you can</b>.</p>
                    <p style={{"display": (keys['keynum']==undefined)?"none":"block"}}>Remember two things! First, You should do it <b>as fast as you can</b> <b>(but if you think it will not be dangerous, do not press any key)</b>.</p>
                    <p>Also, if the object can be dangerous in <b>near future</b>, you should decide the object to be dangerous, even if it is not yet dangerous!</p>
                    <img src="/static/task_interface.gif" style={{'border':'solid 3px black'}}></img>
                    <p>To annotate the object as dangerous, press "{keys['yes']}" on keyboard.</p>
                    <p style={{"display": (keys['keynum']!=undefined)?"none":"block"}}>To annotate the object as not dangerous, press "{keys['no']}" on keyboard.</p>
                    <p style={{"display": (keys['keynum']==undefined)?"none":"block"}}>If the object would not be dangerous, do not press any button.</p>
                    <p style={{"display": (keys['hand']==undefined)?"none":"block"}}>Use your <b>two hands</b>, placing your left hand on "{keys['yes']}" and your right hand on "{keys['no']}".</p>
                    <p style={{"display": (keys['training']==undefined)?"block":"none"}}>You will do two rounds of tutorials first. Then 2 task videos.</p>
                    <p style={{"display": (keys['training']!=undefined)?"block":"none"}}>You will first go through a <b>training stage</b>. Then, you will do <b>two rounds of tutorials</b>. Then <b>2 task videos</b>.</p>
                    <p>If you are ready to proceed, press the button below.</p>
                    <span onClick={this.toTutorial.bind(this)}
                    className={'btn '+(task_availability ? 'show':'hidden')}>Proceed</span>
                </div>
    
            )
        }else{
            return (<div>
                <h5>You already participated in the test! Thank you for showing interest, but we would want participants who did not do the task yet.</h5>
            </div>)
        }
        
    }
    
}

export default createContainer((props) => {
    var wid = Gup('workerId')
    Meteor.subscribe('worker-annotation', wid)

    return {
        workerAnnotations: Annotations.find().fetch(),
    }
}, Instruction);