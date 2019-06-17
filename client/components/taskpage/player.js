import React, {Component} from 'react';
class Player extends Component{
    player=undefined;

    componentDidMount(){
        var _this = this
        this.player = new Vimeo.Player(document.getElementById('player'))
        this.player.on('timeupdate', function(data){
            console.log('update', data.percent)
            if(data.percent==1){
                console.log("late")
                _this.props.lateTask();
                
            }    
        })
        this.player.on('loaded', function(data){
            _this.player.pause()
            _this.props.videoisLoaded()
            setTimeout(function(){
                _this.player.play()
                _this.props.addKeyListener()
            }, 3000)
            //_this.player.play();
        })
    }

    getVideoTime(){
        return this.player.getCurrentTime();
    }

    render(){
        var playerWidth = window.innerWidth * 0.7
        var playerHeight = playerWidth/1.6 * 0.9

        return (
            <div>
                <iframe id="player" src={this.props.videoUrl+"?&background=0&autoplay=1"}
                width={playerWidth.toString()+"px"} height={playerHeight.toString()+"px"} frameborder="0" 
                allow="autoplay" className="taskVideo">
                </iframe>
            </div>
        )
    }
}

export default Player;