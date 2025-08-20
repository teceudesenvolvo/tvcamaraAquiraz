import React from 'react';
import logoAquiraz from '../../src/assets/images/logoAquiraz.png'; // Importe a logo

import ReactPlayer from 'react-player';
import { clickButton, LoggedOut } from '../store/actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';


class Liveatual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenAccess: null,
      liveStreamId: null,
      playlistVideoId: null,
      videoTitle: 'TV Câmara de Pacatuba',
      videoDescription: 'Acompanhe ao vivo as sessões e audiências públicas.',
      videoThumbnailUrl: null,
      isLive: false,
      showIframe: false,
    };
    this.handlePlayClick = this.handlePlayClick.bind(this);
  }

  // Métodos de autenticação e busca de streams - (sem alterações)
  getAccessToken = async () => {
    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          client_id: '690193859816-clfb1alj3telks2pn44cpgrcte4unt79.apps.googleusercontent.com',
          client_secret: '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',
          refresh_token: '1//0hGQmkhgnpw65CgYIARAAGBESNwF-L9IrwfwjVYJddwl3Cl8-naCqEE79Yhj0XQusqSC1Et7FzTvENKvcz2yPh-Kn8EHs5SioyGI',
          grant_type: 'refresh_token',
          scope: 'https://www.googleapis.com/auth/youtube.readonly',
          redirect_uri: 'https://tvcamara.cmaquiraz.ce.gov.br/'
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
    // const API_KEY = 'AIzaSyAvzOdQzU-H_tneJBcbVnmO60dEzWMKhT4';
    // const PLAYLIST_ID = 'PLTrq6afnTQmGtNTPcf5fidnO6wF4ZtSgU';

    axios.get('').then(response => {
      console.log(response);
      const items = response.data.items;

      // CORREÇÃO AQUI: Acessando o primeiro item do array
      const videoItem = items.length > 0 ? items[0] : null;

      if (videoItem) {
        const thumbnailUrl = videoItem.snippet.thumbnails.maxres?.url || videoItem.snippet.thumbnails.high?.url;

        const liveStreamItem = items.find(item => item.snippet.title.toLowerCase().includes('ao vivo'));

        if (liveStreamItem) {
          const liveStreamId = liveStreamItem.snippet.resourceId.videoId;
          this.setState({
            liveStreamId,
            isLive: true,
            showIframe: false,
            videoTitle: liveStreamItem.snippet.title,
            videoDescription: liveStreamItem.snippet.description,
            videoThumbnailUrl: thumbnailUrl,
          });
        } else {
          const latestVideoId = videoItem.snippet.resourceId.videoId;
          this.setState({
            playlistVideoId: latestVideoId,
            isLive: false,
            showIframe: false,
            videoTitle: videoItem.snippet.title,
            videoDescription: videoItem.snippet.description,
            videoThumbnailUrl: thumbnailUrl,
          });
        }
      }
    }).catch(error => {
      console.error('Erro ao buscar itens da playlist:', error);
    });
  };

  componentDidMount() {
    this.getAccessToken();
  }

  handlePlayClick() {
    this.setState({ showIframe: true });
  }

  render() {
    const { liveStreamId, playlistVideoId, videoTitle, videoThumbnailUrl, isLive, showIframe } = this.state;

    if (!this.state) {
      return null;
    }

    const videoUrl = liveStreamId
      ? `https://www.youtube.com/watch?v=${liveStreamId}`
      : playlistVideoId
        ? `https://www.youtube.com/watch?v=${playlistVideoId}`
        : null;

    return (
      <div
        className="hero-player-section"
        style={{
          backgroundImage: videoThumbnailUrl ? `url(${videoThumbnailUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        {videoUrl ? (
          <>
            <div className="video-player-container">
              {showIframe && (
                <ReactPlayer
                  className="react-player"
                  url={videoUrl}
                  controls={true}
                  width="100%"
                  height="100%"
                  playing={true}
                />
              )}
            </div>

            {!showIframe && (
              <>
                <div className="video-overlay"></div>
                <div className="logo-container">
                  <img src={logoAquiraz} alt="Logo Câmara de Aquiraz" className="logo" />
                </div>
                <div className="player-content-info">
                  <p>Bem-vindo a TV Câmara de Aquiraz</p>
                  <h1>{videoTitle}</h1>
                  <button
                    className="btn-player"
                    onClick={this.handlePlayClick}
                  >
                    {isLive ? 'Assistir Ao Vivo' : 'Assistir Agora'}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="player-content-info" style={{ position: 'relative', transform: 'none', textAlign: 'center' }}>
            <h1>Não há transmissão ao vivo no momento.</h1>
            <p>Aguarde a próxima sessão ou confira o conteúdo mais recente na nossa playlist.</p>
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ clickButton, LoggedOut }, dispatch);
}

export default connect(null, mapDispatchToProps)(Liveatual);