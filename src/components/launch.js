import React from 'react';
import '../App.css'
import ReactPlayer from 'react-player';

import { connect } from 'react-redux'
import { clickButton, LoggedOut } from '../store/actions/index'
import { bindActionCreators } from 'redux';

import axios from 'axios'


class Lançamento extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      id: '566',
      tipo: 'aviso',
      avisos: [],
      carregar: 'Carregar Avisos',
      btnLoad: "visitanteBtn"
    }
  }



  // Carrega Ultima Live
  loadAula = async () => {
    axios.get(`https://youtube.googleapis.com/youtube/v3/liveStreams?part=snippet&channelId=$UCjxnvUBYTWsp_zmkFKOvkQA&key=AIzaSyAGmrhhQcFv7Ga0Hyc50r9RyANRvdY7QsQ`)
      .catch(err => console.log(err))
      .then(res => {
        const videoAll = res.data.items

        const videos = videoAll.filter(content => content.contentDetails.videoId.includes(this.props.idAula))
        
        console.log(videos)
        this.setState({
          idVideo: videos[0].snippet.title,
        })
      })

  }



  render() {

    return (
      <div>
        <section>
          <div className="backgroundLaunch">
            <p>
              {/* <img className="backgroundLaunch imgFilter" src={backgroundLive} alt='backgroundLive'/> */}
            </p>
            <div className="curso-lancamento">
              {/* <h1 className="title-curso-lancamento">Ao Vivo</h1>
              <p className="desc-curso-lancamento">Assista agora</p> */}
              <p>
                {/* <input type="button" value="Assista Agora" className="btn-curso-lancamento" 
                  onClick={
                    () => {this.setState({id: this.state.cousesAll}, () => {
                      (this.props.clickButton(this.state))
                      (window.location.href = "/item")
                    })}}
                    /> */}
                {/* <input type="button" value="Saber Mais" className="btn-curso-lancamento2" 
                  onClick={
                    () => {this.setState({id: this.state.idCourseDestaque}, () => {
                      (this.props.clickButton(this.state))
                      (window.location.href = "/item")
                    })}}
                    /> */}
              </p>
              <div className='videoLiveInicio'>
                <ReactPlayer className="watchVideo" scrolling="no" frameborder="0" onload="iFrameResize()"
                  url={`https://youtu.be/Hi3vL5Gw2zY`} controls='true' />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return bindActionCreators({ clickButton, LoggedOut }, dispatch);
}

export default connect(null, mapDispatchToProps)(Lançamento);