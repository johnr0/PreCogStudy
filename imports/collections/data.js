import { Mongo } from 'meteor/mongo'
import  validUrl from 'valid-url';
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'video.add': function(videoname, url){
        if (validUrl.isUri(url)){
            Videos.insert({
                name: videoname, 
                url: url,
            })
        }else{
            console.log("not valid url")
        }
        return
    },

    'video.remove': function(vid){
        Videos.remove(vid)
    },

    'annotation.startTask': function(wid, aid, hid, videoid,sendTo, keycode){

        var anno = Annotations.findOne({wid:wid, aid:aid, hid:hid, videoid:videoid})
        if(!anno){
            Annotations.insert({
                videoid:videoid,
                wid:wid,
                aid:aid,
                hid:hid,
                endtime:new Date(),
                starttime:new Date(),
                pageduration: -1,
                videoduration: -1,
                code: sendTo,
                prediction: "Not yet done",
                keycode: keycode,
            })
        }
        console.log('annotation addition success')
    },

    'annotation.annotate': function(wid, aid, hid, videoid, pageduration, prediction, keycode){
        Annotations.update({wid:wid, aid:aid, hid:hid, videoid:videoid, keycode:keycode,},
            {$set: {pageduration:pageduration, prediction:prediction, endtime:new Date(),}})
        console.log('annotate success', prediction)
    },

    'annotation.videoduration': function(wid,aid,hid,videoid,videoduration, keycode){
        Annotations.update({wid:wid, aid:aid, hid:hid, videoid:videoid, keycode:keycode,},
            {$set: {videoduration:videoduration}})
        console.log('videoduration success')
    },

    'annotation.removeWorker': function(wid){
        Annotations.remove({wid:wid})
    }
})

export const Videos = new Mongo.Collection('videos');
export const Annotations = new Mongo.Collection('annotations');