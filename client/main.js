import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import Instruction from './components/instruction/insturction'
import TaskWrapper from './components/taskpage/taskwrapper'
import VideoManagement from './components/videomanagement/videomanagement'
import WorkerManagement from './components/videomanagement/workermanagement'
import Ready from './components/taskpage/ready'
import Submit from './components/mturkSubmit/submit'
import Training from './components/taskpage/training'

//<Route path="/instruction/:condition/:workerId/:assignmentId/:hitId/:videoname" component={Instruction} />
const routes = (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/instruction/:keycode" component={Instruction}/>
        <Route path="/ready/:keycode/:videoname/:wid/:aid/:hid/:sendTo" component={Ready}/>
        <Route path="/task/:keycode/:videoname/:wid/:aid/:hid/:sendTo" component={TaskWrapper}/>
        <Route path="/submit/:keycode/:wid/:aid/:hid/:sendTo" component={Submit}/>
        <Route path="/videomanagement/:keycode" component={VideoManagement}/>
        <Route path="/videomanagement/" component={VideoManagement}/>
        <Route path="/workermanagement/" component={WorkerManagement}/>
        <Route path="/training/:keycode/:wid/:aid/:hid/:sendTo" component={Training}/>
      </Switch>
    </div>
  </BrowserRouter>
)

//this function renders components in the class task_page
Meteor.startup(()=>{
  ReactDOM.render(routes, document.querySelector('.interface'));
})
