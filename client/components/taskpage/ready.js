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
        if(videoname=="training"){
            window.location.href = '/training/'+keycode+"/"+wid+"/"+aid+"/"+hid+"/"+sendTo
        }else{
            window.location.href = '/task/'+keycode+"/"+videoname+"/"+wid+"/"+aid+"/"+hid+"/"+sendTo
        }
        
    }
    
    render(){
        var keycode = this.props.match.params.keycode
        // left: 37 / right: 39/ up: 38
        //

        var keys = KeyToString(keycode)


        var task_type = this.props.match.params.videoname
        if (!task_type.includes('tut')&&task_type!='training'){

            task_type="Task "+(parseInt(task_type)+1).toString()
        }
        return (
            <div>
                <h4 className="taskHeader">Get ready for the {task_type}!</h4>
                <h5 className="taskHeader" style={{"display": (task_type!="training")?"block":"none"}}>Goal: Decide whether an object in a green box {(keys['question']==undefined)?'can jump into the lane and cause a car accident':'can move close to our vehicle within 5~6 seconds'}.</h5>
                <h5 className="taskHeader" style={{"display": (task_type=="training")?"block":"none"}}>Goal: Decide if a big text in your screen is saying "{(keys['question']==undefined)?'Dangerous':'Movable'}".</h5>        
                <h5 className="taskHeader" style={{"display": (keys['keynum']!=undefined)?"none":"block"}}>In the task, <span className="btn">Press <b>{keys['yes']}</b> for Yes</span> and <span className="btn red">Press <b>{keys['no']}</b> for No</span></h5>
                <h5 className="taskHeader" style={{"display": (keys['keynum']==undefined)?"none":"block"}}>In the task, <span className="btn">Press <b>{keys['yes']}</b></span> to indicate {(keys['question']==undefined)?'danger':'movability'}. Otherwise, do not press any key.</h5>
                <h5 className="taskHeader" style={{"display": (keys['hand']==undefined)?"none":"block"}}>Place your finger of left hand on {keys['yes']} and your finger of right hand on {keys['no']}.</h5>
                <h5 className="taskHeader" style={{"display": (task_type=="training")?"block":"none"}}>You have to collect 20 points.<br/> If you give right input within 0.8 seconds, you will get +1.<br/> If you give a late or wrong input, you will get -1.</h5>
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