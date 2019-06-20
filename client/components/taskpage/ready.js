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
        var {keycode, videoname, wid, aid, hid, sendTo} = this.props.match.params
        if(videoname.includes("training")){
            window.location.href = '/training/'+keycode+"/"+wid+"/"+aid+"/"+hid+"/"+sendTo
        }else{
            if(videoname.includes("_")){
                videoname = videoname.split("_")[0]
            }
            //if(videoname.includes('tutorial')){
            //    window.location.href = '/task/'+keycode+"/tutorial1/"+wid+"/"+aid+"/"+hid+"/"+sendTo
            //}else{
            //    window.location.href = '/task/'+keycode+"/0/"+wid+"/"+aid+"/"+hid+"/"+sendTo
            //}
            window.location.href = '/task/'+keycode+"/"+videoname+"/"+wid+"/"+aid+"/"+hid+"/"+sendTo
            
        }
        
    }
    
    render(){
        var keycode = this.props.match.params.keycode
        // left: 37 / right: 39/ up: 38
        //

        var keys = KeyToString(keycode)


        var task_type = this.props.match.params.videoname

        var feedback=false
        var feedback_contents=''
        if(task_type.includes('tutorial2')){
            feedback=true;
            var addtype = task_type.split('_')[1]
            if(addtype=='correct'){
                feedback_contents="Correct, because the human could have move into your lane."
            }else if(addtype=='wrong'){
                feedback_contents="You didn't get it correct, because the human could have move into your lane. Please keep the goal in your mind!"
            }else if(addtype=='late'){
                feedback_contents="You should have answered early! Also, the human could have move into your lane. Please keep the goal in your mind!"
            }
        }else if(task_type.includes('0_')){
            feedback=true;
            var addtype = task_type.split('_')[1]
            if(addtype=='correct'){
                feedback_contents="Correct, because the object cannot move into your lane!"
            }else if(addtype=='wrong'){
                feedback_contents="You didn't get it correct, because the object cannot move into your lane. Please keep the goal in your mind!"
            }else if(addtype=='late'){
                if (keys['keynum']!=undefined){
                    feedback_contents = "Correct, because the object cannot move into your lane!"
                }else{
                    feedback_contents = "You should have answered early! Also, the object cannot move into your lane. Please keep the goal in your mind!"
                } 
            }
        }


        if (!task_type.includes('tut')&&!task_type.includes('training')){

            task_type="Tasks! You will do tasks on 10 videos consecutively!"//+(parseInt(task_type)+1).toString()
        }else if(task_type.includes('training')){
            task_type='training'
        }//else if(task_type.includes('tutorial')){
           // task_type='tutorial'
        //}
        if(task_type.includes("_")){
            task_type = task_type.split("_")[0]
        }
        

        return (
            <div>
                <h4 className="taskHeader" style={{'display':(feedback)?"block":"none"}}><u>{feedback_contents}</u></h4>
                <h4 className="taskHeader" style={{'display':(this.props.match.params.videoname!="trainingRe")?"block":"none"}}>Now, get ready for the {task_type}!</h4>
                <h4 className="taskHeader" style={{'display':(this.props.match.params.videoname=="trainingRe")?"block":"none", color:'#dd1111'}}><u>Because you could not get the desired score for the training, you should do the training again.</u></h4>
                <h5 className="taskHeader" style={{"display": (!task_type.includes("training"))?"block":"none"}}>Goal: Decide whether an object in a green box {(keys['question']==undefined)?'can jump into the lane and cause a car accident':'can move close to our vehicle within 5~6 seconds'}.</h5>
                <h5 className="taskHeader" style={{"display": (task_type.includes("training"))?"block":"none"}}>Goal: Decide if a big text in your screen is saying "{(keys['question']==undefined)?'Dangerous':'Movable'}".</h5> 
                <p className="taskHeader" style={{"display": (task_type.includes("training"))?"block":"none"}}>The text will be shown like below, showing either of "Movable" or "Won't move".</p>
                <img src='/static/training.gif' style={{'border':'solid 3px black', "margin":'auto', "display": (task_type.includes("training"))?"block":"none"}}></img>       
                <h5 className="taskHeader" style={{"display": (keys['keynum']!=undefined)?"none":"block"}}>In the task, <span className="btn">Press <b>{keys['yes']}</b> for <b>{(keys['question']==undefined)?'Dangerous':'Movable'}</b></span> and <span className="btn red">Press <b>{keys['no']}</b> for <b>{(keys['question']==undefined)?'Not Dangerous':"Won't move"}</b></span></h5>
                <h5 className="taskHeader" style={{"display": (keys['keynum']==undefined)?"none":"block"}}>In the task, <span className="btn">Press <b>{keys['yes']}</b></span> to indicate {(keys['question']==undefined)?'danger':'movability'}. Otherwise, do not press any key.</h5>
                <h5 className="taskHeader" style={{"display": (keys['hand']==undefined)?"none":"block"}}>Place your finger of left hand on {keys['yes']} and your finger of right hand on {keys['no']}.</h5>
                <h5 className="taskHeader" style={{"display": (task_type.includes("training"))?"block":"none"}}>You will do this training task for 20 times.</h5>
                <p className="taskHeader" style={{"display": (task_type.includes("training"))?"block":"none"}}>If you give right input within 0.8 seconds, you will get a point.<br/> If you get 16 points or more, you would be able to proceed. <br/> If not, you will do the 20 training tasks again.</p>
                <h5 className="taskHeader" style={{"display": (false)?"block":"none"}}>You will watch <u>two</u> tutorial videos in a row.</h5>
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