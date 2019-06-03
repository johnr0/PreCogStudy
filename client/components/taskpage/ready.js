import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Task from './task'

class Ready extends Component{

    componentDidMount(){
        document.addEventListener("keydown", this.taskKeyInput.bind(this))
    }

    taskKeyInput(event){
        if(event.keyCode==38){
            this.toTask()
        }
    }

    toTask(){
        const {videoname, wid, aid, hid, sendTo} = this.props.match.params
        window.location.href = '/task/'+videoname+"/"+wid+"/"+aid+"/"+hid+"/"+sendTo
    }
    
    render(){
        var task_type = this.props.match.params.videoname
        return (
            <div>
                <h4 className="taskHeader">Get ready for the {task_type}!</h4>
                <h5 className="taskHeader">Goal: Decide whether an object in a red box can cause an accident to our vehicle.</h5>
                <h5 className="taskHeader">In the task,</h5>
                <div className="taskButtons" style={{"pointerEvents":"none"}} >
                    <span className="btn">Press ← for Yes</span>
                    <span className="btn red">Press → for No</span>
                    </div>
                <span style={{"margin":"auto", "display":"block", "pointerEvents":"none"}} 
                className='btn'>
                Press Up Arrow (↑) to proceed to {task_type}</span>
            </div>
        )
    }
}

export default createContainer((props) => {
    return {}
}, Ready);