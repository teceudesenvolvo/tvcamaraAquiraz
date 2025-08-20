import React from 'react';
import { connect } from 'react-redux';
import { openAula, LoggedOut } from '../store/actions/index';
import { bindActionCreators } from 'redux';
import axios from 'axios';

class Avisos extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        sessoes: [], 
        currentPage: 1,
        totalPages: 1,
        isLoading: false,
      };
    }

    // Função para extrair o ID e tipo de plataforma do vídeo a partir da URL
    getVideoInfo = (url) => {
      if (!url) {
        return { type: null, id: null };
      }

      // Regex para URLs do YouTube
      const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/(?:v|e(?:mbed)?)\/)([^"&?/\s]{11})/;
      const youtubeMatch = url.match(youtubeRegex);
      if (youtubeMatch && youtubeMatch[1].length === 11) {
        return { type: 'youtube', id: youtubeMatch[1] };
      }

      // Regex para URLs do Facebook
      const facebookRegex = /(?:facebook\.com\/.*\/videos\/|fb\.watch\/)([0-9]+)/;
      const facebookMatch = url.match(facebookRegex);
      if (facebookMatch) {
          return { type: 'facebook', id: facebookMatch[1] };
      }

      // Regex para links curtos do Facebook
      const fbWatchRegex = /fb\.watch\/([^\s]+)/;
      const fbWatchMatch = url.match(fbWatchRegex);
      if (fbWatchMatch) {
          return { type: 'facebook', id: fbWatchMatch[1] };
      }

      return { type: null, id: null };
    };

    // Método para carregar as sessões da API do SAPL
    loadSessoes = async () => {
      this.setState({ isLoading: true });
      try {
        // Fazer a requisição inicial para obter o número total de páginas
        const resInitial = await axios.get(`https://sapl.aquiraz.ce.leg.br/api/sessao-plenaria/`);
        const totalPages = resInitial.data.pagination.total_pages;

        let sessoesFromPage = [];
        if (totalPages > 0) {
            // Carrega a última página
            const pageOne = totalPages;
            const resSaplOne = await axios.get(`https://sapl.aquiraz.ce.leg.br/api/sessao-plenaria/?page=${pageOne}`);
            sessoesFromPage = resSaplOne.data.results || [];
            
            // Se houver mais de uma página, carrega a penúltima e a concatena
            if (totalPages > 1) {
                const pageTwo = totalPages - 1;
                const resSaplTwo = await axios.get(`https://sapl.aquiraz.ce.leg.br/api/sessao-plenaria/?page=${pageTwo}`);
                // Adiciona as sessões da penúltima página ao final do array
                sessoesFromPage = [...sessoesFromPage, ...(resSaplTwo.data.results || [])];
            }
        }
        
        // Mapeia os dados da API do SAPL
        const sessoes = sessoesFromPage.map(sessao => {
          const videoInfo = this.getVideoInfo(sessao.idYoutube);
          let thumbnailUrl = '';
          
          if (videoInfo.type === 'youtube' && videoInfo.id) {
            thumbnailUrl = `https://img.youtube.com/vi/${videoInfo.id}/hqdefault.jpg`;
          } else if (videoInfo.type === 'facebook' && videoInfo.id) {
            thumbnailUrl = 'https://placehold.co/600x400/3b5998/ffffff?text=Vídeo+no+Facebook';
          } else {
            thumbnailUrl = 'https://placehold.co/600x400/CCCCCC/000000?text=Sessão+Plenária';
          }

          return {
            codReuniao: sessao.codReuniao,
            titulo: sessao.txtTituloReuniao || 'Sessão Plenária',
            thumbnailUrl: thumbnailUrl,
            idYoutube: sessao.idYoutube,
          };
        }).filter(sessao => sessao.idYoutube);
        
        // A API já retorna os itens da página em ordem crescente. Para que as sessões mais recentes fiquem no topo da lista, a ordenação é feita aqui.
        const sortedSessoes = sessoes.sort((a, b) => b.codReuniao - a.codReuniao);

        this.setState({ 
          sessoes: sortedSessoes,
          totalPages: totalPages,
          currentPage: totalPages > 1 ? totalPages - 1 : totalPages,
          isLoading: false
        });

      } catch (err) {
        console.error("Erro ao carregar sessões:", err);
        this.setState({ sessoes: [], isLoading: false });
      }
    }

    // Função para carregar mais sessões
    loadMoreSessoes = async () => {
        const { currentPage, sessoes } = this.state;
        if (currentPage > 1) {
            this.setState({ isLoading: true });
            try {
                const resSapl = await axios.get(`https://sapl.aquiraz.ce.leg.br/api/sessao-plenaria/?page=${currentPage - 1}`);
                const sessoesFromPage = resSapl.data.results || [];
                const newSessoes = sessoesFromPage.map(sessao => {
                    const videoInfo = this.getVideoInfo(sessao.idYoutube);
                    let thumbnailUrl = '';
                    if (videoInfo.type === 'youtube' && videoInfo.id) {
                        thumbnailUrl = `https://img.youtube.com/vi/${videoInfo.id}/hqdefault.jpg`;
                    } else if (videoInfo.type === 'facebook' && videoInfo.id) {
                        thumbnailUrl = 'https://placehold.co/600x400/3b5998/ffffff?text=Vídeo+no+Facebook';
                    } else {
                        thumbnailUrl = 'https://placehold.co/600x400/CCCCCC/000000?text=Sessão+Plenária';
                    }
                    return {
                        codReuniao: sessao.codReuniao,
                        titulo: sessao.txtTituloReuniao || 'Sessão Plenária',
                        thumbnailUrl: thumbnailUrl,
                        idYoutube: sessao.idYoutube,
                    };
                }).filter(sessao => sessao.idYoutube);

                this.setState(prevState => ({
                    // Adiciona as novas sessões ao final da lista, mantendo a ordem inversa
                    sessoes: [...prevState.sessoes, ...newSessoes.reverse()],
                    currentPage: prevState.currentPage - 1,
                    isLoading: false
                }));
            } catch (err) {
                console.error("Erro ao carregar mais sessões:", err);
                this.setState({ isLoading: false });
            }
        }
    };

    componentDidMount() {
      this.loadSessoes();
    }
  
    render() {
      const { sessoes, currentPage, totalPages, isLoading } = this.state; 
      
      const listSessoes = sessoes.map((sessao) => 
          <li className="Areas type1" key={sessao.codReuniao}
          onClick={() => {
            console.log(sessao.codReuniao);
            // Salva o ID da sessão e o ID do YouTube no localStorage
            localStorage.setItem('codReuniao', sessao.codReuniao);
            localStorage.setItem('idYoutube', sessao.idYoutube);

            // Redireciona para a página do player
            window.location.href = "/player";
          }}
          >
              <img src={sessao.thumbnailUrl} alt='thumbnail da sessão'/>
              <div className="overlay"></div>
              <p className='titleCard'> {sessao.titulo} </p>
          </li>
      );
    
      return (
        <div>
          <section className="courses">
            <div className="divTitleSection">
              {/* <p className="newsSection">Últimas Sessões</p> */}
            </div>
            <ul  className="listAreas2">
              {listSessoes}
            </ul>
            {currentPage > 1 && (
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <button
                        onClick={this.loadMoreSessoes}
                        disabled={isLoading}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            opacity: isLoading ? 0.6 : 1,
                        }}
                    >
                        {isLoading ? 'Carregando...' : 'Carregar mais'}
                    </button>
                </div>
            )}
          </section>
        </div>
      );
    }
}

const mapStateToProps = store => {
  return {
    id: store.course.id,
    idAula: store.course.idAula,
    idCurso: store.course.idCurso,
    tipoAula: store.course.tipoAula,
    tipoItem: store.course.tipo,
    userId: store.user.userId,
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({openAula, LoggedOut}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Avisos);
