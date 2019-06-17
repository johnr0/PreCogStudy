import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Gup from '../mturk/gup';
import { KeyToString } from '../keycodes'
import { Meteor } from 'meteor/meteor';
import {Annotations} from '../../../imports/collections/data'

class Instruction extends Component{

    toTutorial(){
        var wid = Gup('workerId')
        var aid = Gup('assignmentId')
        var hid = Gup('hitId')
        var sendTo = Gup('turkSubmitTo')

        const {keycode} = this.props.match.params

        Meteor.call('worker.startTask', wid, aid, hid, sendTo, keycode)

        
        var keys = KeyToString(keycode)
        if(keys['training']==undefined){
            window.location.href = "/ready/"+keycode+"/tutorial1/"+Gup('workerId')+"/"+Gup('assignmentId')+"/"+Gup('hitId')+"/"+Gup('turkSubmitTo')
        }else{
            window.location.href = "/ready/"+keycode+"/training/"+Gup('workerId')+"/"+Gup('assignmentId')+"/"+Gup('hitId')+"/"+Gup('turkSubmitTo')
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
        //XXXX One hand (2 key), no training, dangerous: left: 37 / right: 39/ up: 38 (37_39_38)
        //XXXX Two hands (2 key), no training, dangerous: E: 69 / I: 73 / Space: 32 / two hands: 2 (69_73_32_2)
        //XXXX One hand (1 key), no training, dangerous: Space: 32 / Q: 81 / Up: 38 / X / one key: 1 (32_81_38__1)
        //XXXX One hand (2 key), training, dangerous: left: 37 / right: 39 / up: 38 / X / X / training: t (37_39_38___t)
        //XXXX Two hands (2 key), training, dangerous: E: 69 / I: 73 / Space: 32 / two hands: 2 (69_73_32_2__t)
        //XXXX One hand (1 key), no training, dangerous: Space: 32 / Q: 81 / Up: 38 / X / one key: 1 (32_81_38__1_t)
        //XXXX One hand (2 key), no training, movable: left: 37 / right: 39/ up: 38 (37_39_38___m)
        //XXXX Two hands (2 key), no training, movable: E: 69 / I: 73 / Space: 32 / two hands: 2 (69_73_32_2___m)
        //XXXX One hand (1 key), no training, movable: Space: 32 / Q: 81 / Up: 38 / X / one key: 1 (32_81_38__1__m)
        // One hand (2 key), training, movable: left: 37 / right: 39 / up: 38 / X / X / training: t (37_39_38___t_m)
        // Two hands (2 key), training, movable: E: 69 / I: 73 / Space: 32 / two hands: 2 (69_73_32_2__t_m)
        // One hand (1 key), no training, movable: Space: 32 / Q: 81 / Up: 38 / X / one key: 1 (32_81_38__1_t_m)

        // E: 69 / I: 73 / Space: 32 / two hands: 2 / X / training: t (69_73_32_2__t)
        // E: 69 / I: 73 / Space: 32 / two hands: 2 / X / training: t / question: can it move? (69_73_32_2__t_m)

        var keys = KeyToString(keycode)
        console.log(keys)

        if(this.props.workerAnnotations.length==0){
            return (
                <div>
                    <h4>The goal of the task is to discern whether an object 'can' {(keys['question']==undefined)?'be dangerous to our vehicle in near future':'move close to our vehicle within 5~6 seconds'}.</h4>
                    <p>You will watch short 1st point-of-view videos of a car driving down a road.</p>
                    <p>In each video, you will see an object that is marked with <span style={{"color":"green"}}>green box</span>.</p>
                    <p><b>As soon as possible</b>, You should decide whether {(keys['question']==undefined)?'the object can jump into the lane and cause a car accident':'the object can move close to our vehicle within 5~6 seconds (possibly can cause an accident)'}.</p>
                    <p style={{"display": (keys['keynum']!=undefined)?"none":"block"}}>Remember two things! First, you should do it <b>as fast as you can</b>.</p>
                    <p style={{"display": (keys['keynum']==undefined)?"none":"block"}}>Remember two things! First, you should do it <b>as fast as you can</b> <b>(but if you think it will not be {(keys['question']==undefined)?'dangerous':'moving'}, do not press any key)</b>.</p>
                    <p>Also, if the object can {(keys['question']==undefined)?'be dangerous':'move close to our vehicle'} in <b>near future</b>, you should decide the object as {(keys['question']==undefined)?'dangerous':'movable'}, even if it is not yet {(keys['question']==undefined)?'dangerous':'moving'}!</p>
                    <img src="/static/task_interface.gif" style={{'border':'solid 3px black'}}></img>
                    <p>To annotate the object as {(keys['question']==undefined)?'dangerous':'movable'}, press "{keys['yes']}" on keyboard.</p>
                    <p style={{"display": (keys['keynum']!=undefined)?"none":"block"}}>To annotate the object as not {(keys['question']==undefined)?'dangerous':'movable'}, press "{keys['no']}" on keyboard.</p>
                    <p style={{"display": (keys['keynum']==undefined)?"none":"block"}}>If the object would not be {(keys['question']==undefined)?'dangerous':'movable'}, do not press any button.</p>
                    <p style={{"display": (keys['hand']==undefined)?"none":"block"}}>Use your <b>two hands</b>, placing your left hand on "{keys['yes']}" and your right hand on "{keys['no']}".</p>
                    <p style={{"display": (keys['training']==undefined)?"block":"none"}}>You will do two rounds of tutorials first. Then 10 task videos.</p>
                    <p style={{"display": (keys['training']!=undefined)?"block":"none"}}>You will first go through a <b>training stage</b>. Then, you will do <b>two rounds of tutorials</b>. Then <b>10 task videos</b>.</p>
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