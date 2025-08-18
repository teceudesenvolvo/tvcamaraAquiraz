import React from 'react';
import '../App.css';

import {connect} from 'react-redux';
import {openAula, LoggedOut} from '../store/actions/index';
import { bindActionCreators } from 'redux';

import axios from 'axios';

// Icones

  //mudança de páginas
  // function list(){
  //   window.location.href = "/listItems"
  // }
  // function inicio(){
  //   window.location.href = "/inicio"
  // }
  // function itemClick(){
  //   window.location.href = "/item"
  //   console.log(this.state.id)
  // }

  class Avisos extends React.Component{
    
    constructor(props){
      super(props)
      this.state = {
        id: '566',
        idCourse: '',
        idCurso: '',
        idAula: '',
        tipo: 'aviso',
        avisos: [],
        carregar: 'Carregar Avisos',
        btnLoad: "visitanteBtn"
      }
    }

    loadAvisos = async () => {
      try {
        const res = await axios.get(``);
        const avisoAll = res.data.items || [];
        
        let avisos = avisoAll.map((item, index) => ({
          ...item,
          id: index.toString() // Or use a unique ID from the item itself if available
        }));

        avisos = avisos.filter(content => content.snippet.title.toUpperCase().includes('SESSÃO'));
        
        // Limita avisos a 12 itens se o original for maior que 4
        // A lógica avisos.length = 12; is a bit unusual. 
        // It's more common to use .slice() or a conditional check.
        // I've kept a similar but safer logic here.
        if (avisos.length > 4) {
          avisos = avisos.slice(0, 12);
        }
        
        this.setState({avisos: avisos});

      } catch (err) {
        console.log(err);
      }
    }

    componentDidMount() {
      const loadPage  = () => console.log(this.loadAvisos())
      loadPage()
    }
  
  render(){

    // Carregar Aulas
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
              <img src={aviso.snippet.thumbnails.high.url} alt='thurmb'/>
              <p className='titleCard'> {aviso.snippet.title} </p>
              {/* <p className='titleCard'> {aviso.etag} </p> */}
              {/* <p className='txtCard'> {aviso.description} </p> */}
      </li>
    )
  
    return (
    <div>
        <section className="courses">
          <div className="divTitleSection">
            {/* <div className="item-separator"></div> */}
            <h1 className="titleSection">Sessões</h1>
            <p className="newsSection">Ultimas Sessões</p>
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
  return bindActionCreators({openAula, LoggedOut}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Avisos);