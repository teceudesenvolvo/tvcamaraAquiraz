import React from 'react';
import '../App.css';

import ReactPlayer from 'react-player';
import { clickButton, LoggedOut } from '../store/actions/index'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';


class Liveatual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenAccess: null,
      liveStreamId: null,
      playlistVideoId: null
    };
  }

  // Autenticação
  getAccessToken = async () => {
    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          client_id: '690193859816-ptc7jnica28b58eh4p42gbrureu2pu13.apps.googleusercontent.com',
          client_secret: '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',
          refresh_token: '1//0h6AWsI4hand9CgYIARAAGBESNwF-L9Ir-sdZiTTIvgpY5A3OQ2vv0x_WEPm4KrZKlLU6X1Qu9UE1PkLEfTm-OKZGdsc-NBEB4hE',
          grant_type: 'refresh_token',
          scope: 'https://www.googleapis.com/auth/youtube.readonly',
          redirect_uri: 'https://tvcamara.cmsga.ce.gov.br/'
        }
      );
      const accessToken = response.data.access_token;
      this.setState({ tokenAccess: accessToken });
      this.fetchLiveStreams(accessToken);
    } catch (error) {
      console.error("Erro ao obter o token de acesso:", error);
    }
  };

  fetchLiveStreams = (accessToken) => {
    const API_KEY = 'AIzaSyAvzOdQzU-H_tneJBcbVnmO60dEzWMKhT4';
    const PLAYLIST_ID = 'PL7WfCTsmLg2UT33p84KHmPjsc3pGd3gPU';

    axios.get('').then(response => {
      console.log(response); // Verificar os dados da resposta da API
      const items = response.data.items;
      const liveStreamItem = items.find(item => item.snippet.title.toLowerCase().includes('ao vivo'));
      if (liveStreamItem) {
        const liveStreamId = liveStreamItem.snippet.resourceId.videoId;
        this.setState({ liveStreamId });
      } else {
        const latestVideoId = items.length > 0 ? items[0].snippet.resourceId.videoId : null;
        this.setState({ playlistVideoId: latestVideoId });
      }
    }).catch(error => {
      console.error('Erro ao buscar itens da playlist:', error);
    });
  };

  componentDidMount() {
    this.getAccessToken();
  }

  render() {
    const { liveStreamId, playlistVideoId } = this.state;

    return (
      <div>
        <section>
          <div className="backgroundLaunch">
            <div className="divTitleSection divTitleSectionLive">
              <h1 className='titleSection titleLive'>Tv Câmara Aquiraz</h1>
              <p className="newsSection msgLive">Estamos ao vivo</p>
            </div>
            <div className="curso-lancamento">
              
              <div className='videoLiveInicio'>
                {liveStreamId ? (
                  <ReactPlayer
                    className="watchVideo"
                    scrolling="no"
                    frameborder="0"
                    url={`https://www.youtube.com/watch?v=${liveStreamId}`}
                    controls='true'
                  />
                ) : (
                  playlistVideoId && (
                    <ReactPlayer
                      className="watchVideo"
                      scrolling="no"
                      frameborder="0"
                      url={`https://www.youtube.com/watch?v=${playlistVideoId}`}
                      controls='true'
                    />
                  )
                )}
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

export default connect(null, mapDispatchToProps)(Liveatual);
