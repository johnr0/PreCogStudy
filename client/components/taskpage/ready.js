import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Task from './task'
import {KeyToString} from '../keycodes'

class Ready extends Component{

    componentDidMount(){
        document.addEventListener("keydown", this.taskKeyInput.bind(this))
    }

    taskKeyInput(event){
        var start = this.props.match.params.keycode.split("_")[2]
        if(event.keyCode==start){
            this.toTask()
        }
    }

    toTask(){
        const {keycode, videoname, wid, aid, hid, sendTo} = this.props.match.params
        window.location.href = '/task/'+keycode+"/"+videoname+"/"+wid+"/"+aid+"/"+hid+"/"+sendTo
    }
    
    render(){
        var keycode = this.props.match.params.keycode
        // left: 37 / right: 39/ up: 38
        //

        var keys = KeyToString(keycode)


        var task_type = this.props.match.params.videoname
        return (
            <div>
                <h4 className="taskHeader">Get ready for the {task_type}!</h4>
                <h5 className="taskHeader">Goal: Decide whether an object in a green box can cause an accident to our vehicle.</h5>
                <h5 className="taskHeader">In the task, <span className="btn">Press <b>{keys['yes']}</b> for Yes</span> and <span className="btn red">Press <b>{keys['no']}</b> for No</span></h5>
                <h5 className="taskHeader" style={{"display": (keys['hand']==undefined)?"none":"block"}}>Place your finger of left hand on {keys['yes']} and your finger of right hand on {keys['no']}.</h5>
                <span style={{"margin":"auto", "pointerEvents":"none", "display": (keys['hand']!=undefined)?"none":"block"}} 
                className='btn'>
                Press <b>{keys['start']}</b> to proceed to {task_type}</span>
                <span style={{"margin":"auto", "pointerEvents":"none", "display": (keys['hand']==undefined)?"none":"block"}} 
                className='btn'>
                Press <b>{keys['start']}</b> with your thumb to proceed to {task_type}</span>
            </div>
        )
    }
}

export default createContainer((props) => {
    return {}
}, Ready);