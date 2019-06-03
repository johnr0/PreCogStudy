import React, { Component } from 'react';
import Gup from './gup'
import { Meteor } from 'meteor/meteor';
class MturkSubmit extends Component{
    state= {
        // when it is false, the submit button is disabled
        submittable:true,
    }
    handleInputChange(event){

    }

    submit(){
        console.log(this.props.type)

    }

    render() {

        return (
            // form for returning task result 
            <div >
                <form ref={ref => (this.form=ref)} method='POST' action={this.props.sendTo!="test" ? decodeURIComponent(this.props.sendTo)+'/mturk/externalSubmit' : undefined }>
                    <input className='hidden' name='assignmentId' value={this.props.assignmentId} onChange={this.handleInputChange}></input>
                    <input className='hidden' name='workerId' value={this.props.workerId} onChange={this.handleInputChange}></input>
                    <input className='hidden' name='hitId' value={this.props.hitId} onChange={this.handleInputChange}></input>
                    <input type='submit' className={"btn submit-button "+(this.state.submittable ? 'show' : 'disabled')}  onClick={this.submit.bind(this)}></input>
                </form>
            </div>
        );
    }
}

export default MturkSubmit;