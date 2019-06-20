import { Meteor } from 'meteor/meteor';
import { Videos, Annotations, Workers } from '../imports/collections/data';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish('all-videos', function(){
    //console.log(Videos.find({}).fetch())
    return Videos.find({});
  })

  Meteor.publish('a-video', function(name, wid){
    console.log(name, wid)
    var vname
    if(name.includes('tut')){
      vname=name
    }else{
      var worker = Workers.find({wid}).fetch()[0]
      //console.log(worker)
      vname = worker.task_list[parseInt(name)]
    }
    
    return Videos.find({name:vname})
  })

  Meteor.publish('all-annotations', function(){
    //console.log(Annotations.find({}).fetch())
    return Annotations.find({});
  })

  Meteor.publish('keycode-annotations', function(keycode){
    return Annotations.find({keycode});
  })

  Meteor.publish('worker-annotation', function(wid){
    return Annotations.find({wid})
  })

  Meteor.publish('a-anno', function(videoname, wid, aid){
    return Annotations.find({videoname:videoname, wid:wid, aid:aid});
  })

  Meteor.publish('all-workers', function(){
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


    return Workers.find({});
  })

  Meteor.publish('a-worker', function(wid){
    return Workers.find({wid});
  })
});
