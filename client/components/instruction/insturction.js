import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Gup from '../mturk/gup';

class Instruction extends Component{

    toTutorial(){
        const {wid, aid, hid} = this.props.match.params
        window.location.href = "/ready/tutorial1/"+Gup('workerId')+"/"+Gup('assignmentId')+"/"+Gup('hitId')+"/"+Gup('turkSubmitTo')
    }

    render(){
        var aid = Gup('assignmentId')
        console.log(aid)
        var task_availability=false;
        if(aid!="" && aid!="ASSIGNMENT_ID_NOT_AVAILABLE"){
            task_availability=true;
        }

        return (
            <div>
                <h4>The goal of task is to discern whether an object 'can' be dangerous to our vehicle in near future.</h4>
                <p>You will watch a short 1st point-of-view video of car driving down a road.</p>
                <p>In the video, you will see an object that is marked with <span style={{"color":"green"}}>green box</span>.</p>
                <p><b>As soon as possible</b>, You should decide whether the object can jump into the lane and <b>cause a car accident</b>.</p>
                <p>Remember two things! First, You should do it <b>as fast as you can</b>.</p>
                <p>Also, if the object can be dangerous in <b>near future</b>, you should decide the object to be dangerous, even if it is not yet dangerous!</p>
                <img src="/static/task_interface.gif" style={{'border':'solid 3px black'}}></img>
                <p>To annotate the object as dangerous, press "Left Arrow (←)".</p>
                <p>To annotate the object as not dangerous, press "Right Arrow (→)".</p>
                <p>You will do two rounds of tutorials first.</p>
                <p>If you are ready to proceed, press the button below.</p>
                <span onClick={this.toTutorial.bind(this)}
                className={'btn '+(task_availability ? 'show':'hidden')}>Proceed</span>
            </div>

        )
    }
    
}

export default Instruction;