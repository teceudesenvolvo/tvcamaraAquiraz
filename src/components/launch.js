import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';

class PenultimaSessao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      tipo: '',
      materias: [],
      uriVideo: '',
    };
  }

  // Função para extrair o ID e tipo de plataforma do vídeo a partir da URL
  getVideoInfo = (url) => {
    if (!url) {
      return { type: null, id: null };
    }
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/(?:v|e(?:mbed)?)\/)([^"&?/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1].length === 11) {
      return { type: 'youtube', id: youtubeMatch[1] };
    }
    return { type: null, id: null };
  };

  // Método para carregar uma sessão aleatória da penúltima página
  loadPenultimaSessao = async () => {
    try {
      // Faz a requisição inicial para obter o número total de páginas
      const resInitial = await axios.get(`https://sapl.aquiraz.ce.leg.br/api/sessao-plenaria/`);
      const totalPages = resInitial.data.pagination.total_pages;
      
      let foundSessao = null;

      // Se houver pelo menos 2 páginas, busca na penúltima
      if (totalPages >= 2) {
          const res = await axios.get(`https://sapl.aquiraz.ce.leg.br/api/sessao-plenaria/?page=${totalPages - 1}`);
          const sessoes = res.data.results || [];
          
          if (sessoes.length > 0) {
              // Embaralha as sessões para pegar uma aleatória
              const shuffledSessoes = sessoes.sort(() => 0.5 - Math.random());

              // Usa o método find para encontrar a primeira sessão com um ID de vídeo
              foundSessao = shuffledSessoes.find(sessao => this.getVideoInfo(sessao.idYoutube).id);
          }
      }

      // Se uma sessão com vídeo for encontrada, atualiza o estado
      if (foundSessao) {
          const videoInfo = this.getVideoInfo(foundSessao.idYoutube);
          this.setState({
              title: foundSessao.txtTituloReuniao || 'Título não disponível',
              tipo: foundSessao.txtTipoReuniao || 'Tipo não disponível',
              materias: foundSessao.txtObjeto ? foundSessao.txtObjeto.split(',').map(m => m.trim()) : [],
              uriVideo: `https://www.youtube.com/watch?v=${videoInfo.id}`
          });
      } else {
          console.log("Nenhuma sessão com vídeo encontrada na penúltima página.");
      }

    } catch (err) {
      console.error("Erro ao carregar a sessão com vídeo:", err);
    }
  };

  componentDidMount() {
    this.loadPenultimaSessao();
  }

  render() {
    const { title, tipo, materias, uriVideo } = this.state;
    const showVideo = uriVideo !== '';

    return (
      <div className="penultima-sessao-container">
        <div className="content-wrapper">
          {showVideo && (
            <div className="video-player-penultima">
              <ReactPlayer
                url={uriVideo}
                controls={true}
                width="95%"
                height="100%"
              />
            </div>
          )}
          <div className="text-content">
            <h1>{title}</h1>
            <p><strong>Tipo:</strong> {tipo}</p>
            <p><strong>Matérias:</strong></p>
            <ul>
              {materias.length > 0 ? (
                materias.map((materia, index) => (
                  <li key={index}>{materia}</li>
                ))
              ) : (
                <li>Nenhuma matéria disponível</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default PenultimaSessao;
