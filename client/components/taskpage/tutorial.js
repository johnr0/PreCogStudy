import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Task from './task'

class Tutorial extends Component{

    taskDone(answer){
        var tut = this.props.tutorial
        var correct_answer = 'yes'
        if (tut=="tutorial1"){
            correct_answer='yes'
        }else if (tut=="tutorial2"){
            correct_answer='no'
        }
        var confirm_message = ''
        if(correct_answer=='yes'){
            if(correct_answer==answer){
                confirm_message = "Correct! Because the vehicle could have move into your lane, it could have harm your vehicle."
            }else{
                confirm_message = "Because the vehicle could have move into your lane, it could have harm your vehicle. Please keep the goal in your mind!"
            }
        }else if(correct_answer=='no'){
            if(correct_answer==answer){
                confirm_message = "Because the tree cannot move into your lane, it cannot harm your vehicle. Please keep the goal in your mind!"
            }else{
                confirm_message = "Correct! Because the tree cannot move into your lane, it cannot harm your vehicle."
            }
        }

        var redirect_path = "/ready/tutorial2"

        if(tut=="tutorial1"){
            redirect_path="/ready/tutorial2"
        }else if(tut=="tutorial2"){
            redirect_path="/ready/task"
        }
        
        if(confirm(confirm_message)){
            window.location.href=redirect_path
        }
    }

    render(){
        return (
            <div>
                <Task taskDone={this.taskDone.bind(this)}></Task>
                
            </div>
        )
    }
}

export default createContainer((props) => {
    return {}
}, Tutorial);