import React from 'react';

import {connect} from 'react-redux'
import {clickButton, openAula, LoggedOut} from '../store/actions/index'
import { bindActionCreators } from 'redux';

import axios from 'axios'


// Icones

  class Elas extends React.Component{
    
    constructor(props){
      super(props)
      this.state = {
        id: '566',
        tipo: 'aviso',
        avisos: [],
        carregar: 'Carregar Elas',
        btnLoad: "visitanteBtn"
      }
    }

    loadAvisos = async () => {
      try {
        const res = await axios.get(``);
        const avisoAll = res.data.items || [];
        
        let avisos = avisoAll.map(item => ({
          ...item,
          id: item.etag
        }));

        avisos = avisos.filter(content => content.snippet.title.toUpperCase().includes('SOLENE'));

        if (avisos.length > 4) {
          avisos = avisos.slice(0, 4);
        }
        this.setState({ avisos });
        console.log('1');
      } catch (err) {
        console.log(err);
      }
    }

    componentDidMount() {
      this.loadAvisos();
    }
  
  render(){

    const avisos = this.state.avisos 
  
    const listAvisos = avisos.map((aviso) => 
        <li className="Areas type1" key={aviso.id}
        onClick={
          () => {this.setState({idAula: aviso.contentDetails.videoId, idCurso: aviso.id, tipo: 'class'}, () => {
            (this.props.openAula(this.state))
            console.log(this.props.idAula)
            (window.location.href = "/player")
          })}
        }
        >
              <img src={aviso.snippet.thumbnails.high.url} alt='thumbnail'/>
              {/* Adicione o overlay e o título dentro de uma div */}
              <div className="overlay"></div>
              <p className='titleCard'> {aviso.snippet.title} </p>
      </li>
    )
  
    return (
    <div>
        <section className="eventos">
          <div className="divTitleSection">
            <p className="newsSection">Eventos Recentes da Câmara</p>
          </div>
            <ul  className="listAreas2">
              {listAvisos}
            </ul>
        </section>

      </div>
    );
  }
}

const mapStateToProps = store => {
  return{
    id: store.course.id,
    idAula: store.course.idAula,
    idCurso: store.course.idCurso,
    tipoAula: store.course.tipoAula,
    tipoItem: store.course.tipo,
    userId: store.user.userId,
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({openAula, clickButton, LoggedOut}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Elas);