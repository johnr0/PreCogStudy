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
   return Workers.find({});
  })

  Meteor.publish('a-worker', function(wid){
    return Workers.find({wid});
  })
});
