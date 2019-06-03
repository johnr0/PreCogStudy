import { Meteor } from 'meteor/meteor';
import { Videos, Annotations } from '../imports/collections/data';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish('all-videos', function(){
    return Videos.find({});
  })

  Meteor.publish('a-video', function(name){
    console.log(name)
    return Videos.find({name:name})
  })

  Meteor.publish('all-annotations', function(){
    return Annotations.find({});
  })

  Meteor.publish('a-anno', function(videoname, wid, aid){
    return Annotations.find({videoname:videoname, wid:wid, aid:aid});
  })
});
