import { Mongo } from 'meteor/mongo'
import  validUrl from 'valid-url';
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

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
        var worker=Workers.find({wid:wid, aid:aid, hid:hid}).fetch()[0]
        order = worker.cur_task
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
                order: order,
            })
            console.log('annotation addition success')
        }
        
    },

    'worker.startTask': function(wid, aid, hid, sendTo, keycode){
        var w = Workers.find({}).fetch();
    for (var i=0; i<w.length; i++){
      var input = w[i].trainingInput.slice(0)
      var latency = w[i].trainingLatency.slice(0)
      var text = w[i].trainingText.slice(0)
      var position = w[i].trainingPosition.slice(0)

      var idxs=[]

      for (var j=0; j<input.length; j++){
        if (input[j].length>20){
          inputs.splice(j, 1);
          latency.splice(j, 1);
          text.splice(j, 1);
          position.splice(j, 1);
        }
      }

      Workers.update({_id:w[i]._id}, {$set:{
        trainingText:text, trainingInput: input, trainingLatency: latency, trainingPosition: position,
      }})


    }
        //Workers.remove({})
        var worker=Workers.find({wid:wid, aid:aid, hid:hid}).fetch()
        console.log(worker)
        if (worker.length==0){
            // 10 tasks
            // 4 dangerous cases (task_danger_n)
            // 4 not dangerous cases (task_safe_n)
            // 1 dangerous case that measures fatigue (task_danger_fatigue)
            // 1 not dangerous case that measures fatigue (task_safe_fatigue)
            var order = []
            var last =""
            if (Math.random()>=0.5){
                order.push('task_danger_fatigue')
                last = 'task_safe_fatigue'
            }else{
                order.push('task_safe_fatigue')
                last = 'task_danger_fatigue'
            }
            var internal_order = ['task_danger_0', 'task_danger_1', 'task_danger_2', 'task_danger_3', 'task_safe_0', 'task_safe_1', 'task_safe_2', 'task_safe_3']
            shuffle(internal_order);

            order = order.concat(internal_order)
            order.push(last)

            Workers.insert({
                wid:wid,
                aid:aid,
                hid:hid,
                code: sendTo,
                keycode:keycode,
                task_list: order,
                cur_task: 0,
                trainingText: [],
                trainingInput: [],
                trainingLatency: [],
                trainingPosition: [],
            })
        }
    },

    'worker.trainingend': function(wid, aid, hid, text, inputs, times, positions){
        //console.log(wid, aid, hid, trainingButtonHits, trainingRounds)
        Workers.update({wid:wid, aid:aid, hid:hid}, 
            {
                $push: {trainingText: text, trainingInput:inputs, trainingLatency:times, trainingPosition:positions}
            })
    },

    'worker.nextTask': function(wid, aid, hid){
        console.log('ADDITION called')
        Workers.update({wid:wid, aid:aid, hid:hid},
            {
                $inc: {cur_task: 1}
            }            
        )
        console.log(Workers.find({wid:wid, aid:aid, hid:hid}))
    },

    'annotation.annotate': function(wid, aid, hid, videoid, pageduration, prediction, keycode){
        Annotations.update({wid:wid, aid:aid, hid:hid, videoid:videoid, keycode:keycode,},
            {$set: {pageduration:pageduration, prediction:prediction, endtime:new Date(),}})
        console.log('annotate success', prediction, wid, aid, hid, videoid, Annotations.find({wid:wid, aid:aid, hid:hid, videoid:videoid, keycode:keycode,}).fetch())
    },

    'annotation.videoduration': function(wid,aid,hid,videoid,videoduration, keycode){
        Annotations.update({wid:wid, aid:aid, hid:hid, videoid:videoid, keycode:keycode,},
            {$set: {videoduration:videoduration}})
        console.log('videoduration success')
    },

    'annotation.removeWorker': function(wid){
        Annotations.remove({wid:wid})
        Workers.remove({wid:wid})
    }
})

export const Videos = new Mongo.Collection('videos');
export const Workers = new Mongo.Collection('workers');
export const Annotations = new Mongo.Collection('annotations');