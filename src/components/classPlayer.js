import React from 'react';
import '../App.css'

import {connect} from 'react-redux'
import {openAula, clickButton} from '../store/actions/index'
import { bindActionCreators } from 'redux';

import axios from 'axios'

import {FaPlayCircle} from 'react-icons/fa'


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

  class Class extends React.Component{
    
    constructor(props){
      super(props)
      this.state = {
        classId: '566',
        tipo: 'aviso',
        aulas: [],
        carregar: 'Carregar Avisos',
        btnLoad: "visitanteBtn",
        idCourse: this.props.idCourse,
        idAula: '',
        tipoItem: this.props.tipoAula,
        
      }
    }

    loadAvisos = async () => {
      try {
        const res = await axios.get(``);
        const aulaAll = res.data.items || [];
        
        let aulas = aulaAll.map((item, index) => ({
          ...item,
          id: index.toString() // Or use a unique ID from the item itself if available
        }));

        // The logic aulas.length = 6; is a bit unusual. 
        // A safer way is to use .slice()
        if (aulas.length > 4) {
          aulas = aulas.slice(0, 6);
        }
        
        this.setState({aulas: aulas});

      } catch (err) {
        console.log(err);
      }
    }

    componentDidMount() {
      const loadPage  = () => this.loadAvisos()
      loadPage()
    }
  
  render(){

    // Avisos
    const aulas = this.state.aulas
    
  
    const listAvisos = aulas.map((aula) => 
        {
        return <li className="class" key={aula.id}
          onClick={() => {
            this.setState({ idAula: `${aula.id}`, tipoAula: `${this.state.tipoItem}`, idCurso: `${aula.idCourse}` }, () => {
              (this.props.openAula(this.state))
              (window.location.href = "/player");
            });
          } }
        >
          <img alt='thurbmail' src={aula.snippet.thumbnails.high.url}/>
          <FaPlayCircle className="iconPlay" /> 
          <p className='titleCard'> {aula.snippet.title} </p>
          </li>;
      }
    )
  
    return (
    <div>
        <section className="class-section">
            <ul  className="class-list">
              {listAvisos}
            </ul>
        </section>
      </div>
    );
  }
}


const mapStateToProps = store => {
  return{
    idAula: store.course.idAula,
    idCurso: store.course.idCurso,
    idCourse: store.course.id,
    tipoAula: store.course.tipoAula,
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({openAula, clickButton}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Class);