import React from 'react';
import {connect} from 'react-redux';
import {openAula, LoggedOut} from '../store/actions/index';
import { bindActionCreators } from 'redux';
import axios from 'axios';

class Avisos extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        sessoes: [], 
        carregar: 'Carregar Sessões',
        btnLoad: "visitanteBtn"
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
      try {
        // Passo 1: Fazer a requisição inicial para obter o número total de páginas
        const resInitial = await axios.get(`https://sapl.aquiraz.ce.leg.br/api/sessao-plenaria/`);
        const totalPages = resInitial.data.pagination.total_pages;

        let sessoesAll = [];
        if (totalPages > 0) {
            // Passo 2: Fazer a requisição para a última página e, se houver, a penúltima
            const pagesToFetch = [];
            pagesToFetch.push(totalPages);
            if (totalPages > 1) {
                pagesToFetch.push(totalPages - 1);
            }
            
            // Faz requisições para cada uma das últimas páginas, começando pela última
            // Não é necessário usar o sort, basta fazer o loop de forma decrescente
            for (let i = pagesToFetch.length - 1; i >= 0; i--) {
                const page = pagesToFetch[i];
                const resSapl = await axios.get(`https://sapl.aquiraz.ce.leg.br/api/sessao-plenaria/?page=${page}`);
                sessoesAll = sessoesAll.concat(resSapl.data.results || []);
                console.log(sessoesAll);
            }
        }

        // Mapeia os dados da API do SAPL e constrói a URL da thumbnail
        const sessoes = sessoesAll.map(sessao => {
          const videoInfo = this.getVideoInfo(sessao.idYoutube);
          let thumbnailUrl = '';
          
          // Define a URL da thumbnail com base na plataforma do vídeo
          if (videoInfo.type === 'youtube' && videoInfo.id) {
            thumbnailUrl = `https://img.youtube.com/vi/${videoInfo.id}/hqdefault.jpg`;
          } else if (videoInfo.type === 'facebook' && videoInfo.id) {
            // Não é possível obter uma thumbnail pública do Facebook sem uma API Key.
            // Usamos uma imagem de placeholder com um ícone de vídeo do Facebook.
            thumbnailUrl = 'https://placehold.co/600x400/3b5998/ffffff?text=Vídeo+no+Facebook';
          } else {
            // Se a URL não for reconhecida, usa um placeholder genérico
            thumbnailUrl = 'https://placehold.co/600x400/CCCCCC/000000?text=Sessão+Plenária';
          }

          return {
            codReuniao: sessao.codReuniao,
            titulo: sessao.txtTituloReuniao || 'Sessão Plenária',
            thumbnailUrl: thumbnailUrl,
            idYoutube: sessao.idYoutube,
          };
        }).filter(sessao => sessao.idYoutube); // Filtra sessões com idYoutube vazio
        
        // Inverte a ordem do array para que os itens mais recentes fiquem no topo
        const ultimasSessoes = sessoes.slice(0, 12).reverse();
        
        this.setState({ sessoes: ultimasSessoes });

      } catch (err) {
        console.error("Erro ao carregar sessões:", err);
        // Em caso de falha, defina um estado vazio para evitar renderização incorreta
        this.setState({ sessoes: [] });
      }
    }

    componentDidMount() {
      this.loadSessoes();
    }
  
    render() {
      const sessoes = this.state.sessoes; 
      
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
