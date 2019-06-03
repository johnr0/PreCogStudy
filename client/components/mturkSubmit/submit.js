import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import MturkSubmit from '../mturk/mturk_submit'

class Submit extends Component{

    render(){
        const {wid, aid, hid, sendTo} = this.props.match.params
        return (
            <div>
                <h5>Congratulation! Submit the task by hitting the button below.</h5>
                <MturkSubmit workerId={wid} assignmentId={aid} hitId={hid} sendTo={sendTo}></MturkSubmit>
            </div>
        )
    }
}

export default Submit;