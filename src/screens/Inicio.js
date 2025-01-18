import React, { Component } from 'react';
import '../App.css'

import {connect} from 'react-redux'
import {clickButton, LoggedIn} from '../store/actions/index'
import { bindActionCreators } from 'redux';

import axios from 'axios'

//Imagens
import bgSite from '../assets/images/capa.png'

// Icones

// Components
import MainMenu from '../components/mainMenu'
import Sessoes from '../components/sections'
import LiveAtual from '../components/liveAtual'
import Lancamentos from '../components/launch'
import Event from '../components/eventos'
import Reunioes from '../components/reunioes'


  //mudança de páginas
  
  class Home extends Component{
    constructor(props){
      super(props)
      this.state = {
        userType: this.props.tipo,
        ouvidoria: '',
        botao:'Enviar',
        title: '',
        description: '',
        teacher: '',
        logoUrl: '',
        idCourseDestaque: '',
        cousesAll: '',
      }
    }

    loadAllCourse = async () => {
      // await axios.get(`courseFeacture.json`)
      await axios.get(``)
        .catch(err => console.log(err))
        .then(res => {
          this.setState({
            cousesAll: res.data.items
          })
          // console.log(this.state.cousesAll)

          this.loadCouseFeactures()
        })
    }


    loadCouseFeactures = async () => {
      // await axios.get(`courses/${this.state.cousesAll}.json`)
      await axios.get(``)
              .catch(err => console.log(err))
              .then(res => {
                this.setState({
                  // title: res.data.title,
                  // subtitle: res.data.subtitle,
                  // description: res.data.description,
                  // teacher: res.data.teacher,
                  // logoUrl: res.data.logoUrl,
                  // imgUrl: res.data.bgUrl,
                  title: res.data.items[1].snippet.title,
                  description: res.data.items[1].snippet.description,
                  // imgUrl: 'https://www.cmpacatuba.ce.gov.br/fotos/260/Capa260.png',
                  imgUrl: '../../src/assets/images/capa.png',
                })
                // console.log(this.state.title)
              })
    }
  
    componentDidMount() {
      const loadPage = () => {
        this.loadAllCourse()
      }

      loadPage()
    }

  
  render(){  

   const userType = () => {
      if(this.props.tipo === 'sindico'){
        window.location.href = "/homeManager"
      }else if(this.props.tipo === ''){
        window.location.href = "/"
      }else{

      }
    }
    
    return (

      <div className="App" onClick={
        userType()
      }>
        <MainMenu/>
        
        {/* <div className="backgroundHero">
          <p><img className="backgroundHero" src={bgSite} alt='background site'/></p>
          <div className="curso-destaque">
            <p><img className="logo-curso-destaque" src={this.state.logoUrl}/></p>
            <h1 className="title-curso-destaque">TV Câmara de São Gonçalo do Amarante</h1>
            <p className="desc-curso-destaque">Câmara Municipal de São Gonçalo do Amarante</p>
            <p><input type="button" value="Assistir Ao Vivo" className="btn-curso-destaque" 
              onClick={
                () => {this.setState({id: this.state.cousesAll}, () => {
                  (this.props.clickButton(this.state))
                  (window.location.href = "/item")
                })}}
                /></p>
          </div>
        </div> */}
        {/* <Lancamentos/> */}
      
        
        <LiveAtual/>


        <Sessoes />

        <Event />

        <Reunioes />

        

      </div>
    );
  }
}

const mapStateToProps = store => {
  return{
    // id: store.lembretes.id,
    // tipo: store.user.tipo,
    // nome: store.user.name,
    // condominio: store.user.condominio,
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({clickButton, LoggedIn}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);