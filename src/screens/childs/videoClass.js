import React, { Component } from 'react';
import ReactPlayer from 'react-player'

import axios from 'axios'
import { connect } from 'react-redux'

// Componetes
import Sessoes from '../../components/sections'
import MainMenu from '../../components/mainMenu'

import '../../App.css'

class Gestao extends Component {
  constructor(props) {
    super(props)
    this.state = {
      idAula: this.props.idAula,
      idCouse: this.props.idCourse,
      tipo: this.props.tipoItem,
      userType: this.props.tipo,
      title: '',
      description: '',
      data: '',
      teacher: 'Professor',
      uriVideo: ``,
      avisos: '',
      videos: '',
      materias: [],
    }
  }


  loadAula = async () => {
    // Pega o codReuniao do localStorage
    const codReuniao = localStorage.getItem('codReuniao');
    const idYoutube = localStorage.getItem('idYoutube');

    if (codReuniao) {
      try {
        // Faz a requisição para a API do SAPL com o codReuniao específico
        const res = await axios.get(`https://sapl.aquiraz.ce.leg.br/api/sessao-plenaria/${codReuniao}/`);
        
        // Pega os dados da reunião
        const sessao = res.data;
        
        // Separa as matérias por vírgula e remove espaços em branco
        const materias = sessao.txtObjeto ? sessao.txtObjeto.split(',').map(m => m.trim()) : [];

        // Atualiza o estado com as informações da API
        this.setState({
          title: sessao.txtTituloReuniao || 'Reunião Plenária',
          tipo: sessao.txtTipoReuniao || 'Tipo não especificado',
          teacher: sessao.txtPresidente || 'Presidente não especificado',
          materias: materias,
          description: sessao.txtApelido || '',
          dataPublic: sessao.datInicio || '',
          uriVideo: idYoutube,
          data: sessao.datReuniaoString || '',
        });

      } catch (err) {
        console.error("Erro ao carregar os dados da reunião:", err);
        // Em caso de erro, defina um estado padrão
        this.setState({
          title: 'Título não encontrado',
          description: 'Não foi possível carregar a descrição da reunião.',
          materias: [],
        });
      }
    }
  }

  componentDidMount() {
    this.loadAula();
  }

  
  render() {
    const { materias } = this.state;
    
    return (
      <div className="App">
        <MainMenu />
        <div className='box-video-aula' style={{ width: '80%', margin: '0 auto' }}>
          <div className='video-play'>
            <ReactPlayer 
              className="playVideoWatch" 
              scrolling="no" 
              frameBorder="0" 
              onLoad="iFrameResize()"
              url={this.state.uriVideo} 
              controls={true}
              width="100%"
              height="100%"
            />
          </div>
          <div className='desc-video' >
            <h1>{this.state.title}</h1>
            <p>{this.state.description}</p>
            <h1 className='teacher'>Matérias:</h1>
            <div style={{ maxWidth: '600px', margin: 'auto' }}>
              {materias.length > 0 ? (
                <ul>
                  {materias.map((materia, index) => (
                    <li key={index}>{materia}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p>Nenhuma matéria disponível</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='players-video'>
          <Sessoes />
        </div>

      </div>
    )
  }
}

const mapStateToProps = store => {
  return {
    id: store.course.id,
    idAula: store.course.idAula,
    idCourse: store.course.idCurso,
    tipoAula: store.course.tipoAula,
    tipoItem: store.course.tipo,
    userId: store.user.userId,
  }
};

export default connect(mapStateToProps)(Gestao)
