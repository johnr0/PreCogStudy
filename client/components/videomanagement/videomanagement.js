import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Videos, Annotations } from '../../../imports/collections/data';

class VideoManagement extends Component{

    addVideo(){
        Meteor.call('video.add', this.refs.videoname.value, this.refs.videourl.value)
        this.refs.videoname.value=""
        this.refs.videourl.value=""
    }

    removeVideo(_id){
        Meteor.call('video.remove', _id)
    }

    removeWorker(wid){
        Meteor.call('annotation.removeWorker', wid)
    }

    renderVideos(){
        return this.props.allVideos.map(video =>{
            return (
                <li key={video._id}>
                    <div className="collapsible-header">
                        <span>{video.name} / {video.url}</span>
                        <span style={{"float":"right", "lineHeight":"20px", "height":"20px"}} 
                        className="btn red"
                        onClick={this.removeVideo.bind(this, video._id)}>delete</span>
                    </div>
                    <div className="collapsible-body">
                        {this.renderAnnotations(video._id)}
                    </div>
                </li>
            )
        })
    }

    renderAnnotations(videoid){
        return this.props.allAnnotations.map(annotation => {
            if (annotation.videoid==videoid){
                return (
                    <div key={annotation._id}>
                        <div>
                            {annotation.wid} / PageDuration: {annotation.pageduration.toFixed(2)} / VideoDuration: {annotation.videoduration.toFixed(2)} / Prediction: {annotation.prediction.toString()}
                            / Actual Duration: {((annotation.endtime-annotation.starttime)/1000).toFixed(2).toString()}
                            <div className="btn red" onClick={this.removeWorker.bind(this, annotation.wid)}>Delete worker task</div>
                        </div>
                        
                    </div>
                )
            }
            
        })
    }

    render(){
        return (
            <div>
                <h4>Add videos</h4>
                <input id="videoname" type="text" className="validate" ref="videoname"></input>
                <label htmlFor="videoname">Video Name</label>

                <input id="videourl" type="text" className="validate" ref="videourl"></input>
                <label htmlFor="videourl">Video Url</label>

                <div style={{"display":"grid", "margin":"auto",}}>
                    <span className="btn" onClick={this.addVideo.bind(this)}>Add a video</span>
                </div>
                <ul className="collapsible">
                    {this.renderVideos()}
                </ul>
            </div>
        )
    }
}

export default createContainer((props) => {
    Meteor.subscribe('all-videos', {})
    Meteor.subscribe('all-annotations', {})
    return {
        allVideos: Videos.find().fetch(),
        allAnnotations: Annotations.find().fetch(),
    }
}, VideoManagement)