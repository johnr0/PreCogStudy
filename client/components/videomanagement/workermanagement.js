import React, {Component} from 'react';
import {Workers} from '../../../imports/collections/data';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

class WorkerManagement extends Component{

    renderWorkers(){
        return this.props.allWorkers.map(worker => {
            console.log(worker.trainingInput)
            console.log(worker.trainingLatency)
            console.log(worker.trainingText)
            console.log(worker.trainingPosition)
            return (
                <li key={worker._id}>
                    <div className="collapsible-header">
                        {worker.wid}
                    </div>
                    <div className="collapsible-body">
                        <p>Text shown: {worker.trainingText} / Input: {worker.trainingInput} / Latency: {worker.trainingLatency} / Position: {worker.trainingPosition}</p>
                        <p></p>
                    </div>
                </li>
            )
        })
    }

    render(){
        return (<div>
            <ul className="collapsible">{this.renderWorkers()}</ul>
            
        </div>)
    }

}

export default createContainer((props) => {
    Meteor.subscribe('all-workers')
    return {
        allWorkers: Workers.find().fetch(),
    }
}, WorkerManagement)