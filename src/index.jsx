import '@/styles/style'
import React from 'react'
import {render} from 'react-dom'
// const data = getData()


import TotalConfirmed from '@/assets/total-confirmed-img.png'
import TotalDeaths from '@/assets/total-deaths-img.png'
import TotalRecovered from '@/assets/total-recovered-img.png'


class App extends React.Component { 

    constructor(props){
        super(props)
        this.getInput = this.getInput.bind(this)
        this.state = {
            data: Object,
            dataCountrys: [],
            inputValue: null
        }

        this.getData()
        this.sortByTotalConfirmed = this.sortByTotalConfirmed.bind(this)
        this.sortByCountry = this.sortByCountry.bind(this)
    }


    getData(){
        fetch('https://api.covid19api.com/summary').then(
            (res) => res.json()
        ).then(
            allData => {this.setState({data: allData, dataCountrys: allData.Countries, dataGlobal: allData.Global})
        })
    }

    sortByTotalConfirmed() {
        const newDataCountryes = this.state.dataCountrys.sort((a, b) => a.TotalConfirmed < b.TotalConfirmed ? 1 : -1)
        this.setState({dataCountrys: newDataCountryes})
      }

    sortByCountry() {
        const newDataCountryes = this.state.dataCountrys.sort((a,b)=>a.Country > b.Country ? 1 : -1)
        this.setState({dataCountrys: newDataCountryes})
    }

    

    getInput = (e) => {
        const inputValue = e.target.value
        let pattenr = new RegExp("^"+inputValue)
        let newDataCountryes = undefined
        inputValue 
        ? newDataCountryes = this.state.data.Countries.filter(country => pattenr.test(country.Country))
        : newDataCountryes = this.state.data.Countries
        this.setState({dataCountrys: newDataCountryes})
    }

    render(){
        return (
            <div className="container">
                <Header getInput={this.getInput}/>
                <Main dataCountrys={this.state.dataCountrys} sortByCountry={this.sortByCountry} sortByTotalConfirmed={this.sortByTotalConfirmed} />
            </div>
        )
    }
}

class Header extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        return(
            <header className="header">
                <div className="header__logo-box">
                    <div className="header__logo"></div>     
                    <h1 className="header__logo-title">STATISTIC</h1>
                </div>
                <div className="header__search-box">
                    <input onChange={this.props.getInput} className="header__search" id="headerSearch" type="text" placeholder="Search..." />
                </div>
            </header>
        )
    }
}

class Main extends React.Component {
    constructor(props){
        super(props)        
        this.state = {
            data: Object,
            dataCountrys: [],
            dataGlobal: [],
            popUpStatus: false,
            countryTitle: 'some country',
            countryConfirmed: 0,
            countryDeaths: 0,
            countryRecovered: 0
        }
        
        this.getPupUp = this.getPupUp.bind(this)
        this.updateData = this.updateData.bind(this)
    }

    getPupUp(e){
        let targetDiv = e.target
        if(targetDiv.className === 'main__list-item'){
            // console.log(targetDiv)
            this.updateStatePopUp(targetDiv)
        }else{
            targetDiv = targetDiv.parentNode
            if(targetDiv.className === 'main__list-item'){
                // console.log(targetDiv)
                this.updateStatePopUp(targetDiv)
            }
        }
        // console.log('start')
    }

    updateStatePopUp(targetDiv){
        this.setState(
            {
                popUpStatus: true, 
                countryTitle: targetDiv.getAttribute('data-title'),
                countryConfirmed: targetDiv.getAttribute('data-totalconfirmed'),
                countryDeaths: targetDiv.getAttribute('data-totaldeaths'),
                countryRecovered: targetDiv.getAttribute('data-totalrecovered')
            }
        )
    }

    updateData = (value) => {
        this.setState({popUpStatus: value})
        // console.log('exit')
    }

    render(){    
        return(
            <main className="main">
                <ul className="main__list" onClick={this.getPupUp}>
                    <ListItem title={true} sortByCountry={this.props.sortByCountry} sortByTotalConfirmed={this.props.sortByTotalConfirmed}/>
                    <div className="main__list-content" id="mainListContent">
                        {this.props.dataCountrys.map((country,i) => (<ListItem key={i} index={i+1} country={country.Country} totalConfirmed={country.TotalConfirmed} totalDeaths={country.TotalDeaths} totalRecovered={country.TotalRecovered} />))}
                    </div>
                </ul>
                {this.state.popUpStatus && <PopUp updateData={this.updateData} title={this.state.countryTitle} totalConfirmed={this.state.countryConfirmed} totalDeaths={this.state.countryDeaths} totalRecovered={this.state.countryRecovered} />}
            </main>
        )
    }
}

class TestElem extends React.Component{
    constructor(props){
        super(props)
        // this.index = this.props.index
        // this.country = this.props.country
        // this.totalConfirmed = this.props.totalConfirmed
        this.className = 'main__list-item'
        this.index = null
        this.country = null
        this.totalConfirmed = null
        if(this.props.title){
            this.className += ' main__list-item_title'
            this.index = '№'
            this.country = 'Country'
            this.totalConfirmed = 'Total Confirmed'
        }
    }

    render(){
        return(
            // <p>{this.props.text}</p>
            <ul className={this.className}>
                <li className="main__list-item-col">{this.props.index}</li>
                <li className="main__list-item-col_line"></li>
                <li className="main__list-item-col" >{this.props.country ? this.props.country : '-'}</li>
                <li className="main__list-item-col_line"></li>
                <li className="main__list-item-col" >{this.props.totalConfirmed}</li>
            </ul>
        )
    }
}

class ListItem extends React.Component {
    constructor (props){
        super(props)
        this.className = 'main__list-item'
        this.index = null
        this.country = null
        this.totalConfirmed = null
        if(this.props.title){
            this.className += ' main__list-item_title'
            this.index = '№'
            this.country = 'Country'
            this.totalConfirmed = 'Total Confirmed'
        }

    }

    render(){
        return (
            <ul className={this.className} data-title={this.props.country} data-totalconfirmed={this.props.totalConfirmed} data-totaldeaths={this.props.totalDeaths} data-totalrecovered={this.props.totalRecovered}>
                <li className="main__list-item-col">{this.index ? this.index : (this.props.index ? this.props.index : '-')}</li>
                <li className="main__list-item-col_line"></li>
                <li className="main__list-item-col" onClick={this.props.title && (()=>{this.props.sortByCountry()})}>{this.country ? this.country : (this.props.country ? this.props.country : '-')}</li>
                <li className="main__list-item-col_line"></li>
                <li className="main__list-item-col" onClick={this.props.title && (()=>{this.props.sortByTotalConfirmed()})}>{this.totalConfirmed ? this.totalConfirmed : (this.props.totalConfirmed ? this.props.totalConfirmed : '-')}</li>
            </ul>
        )
    }
}

class PopUp extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="pop-up">
                <div className="pop-up__bg"></div>
                <div className="pop-up__body">
                    <h2 className="pop-up__title">{this.props.title}</h2>
                    <div className="pop-up__content">
                        <PopUpContentRow img={TotalConfirmed} title="Total Confirmed" value={this.props.totalConfirmed} />
                        <PopUpContentRow img={TotalDeaths} title="Total Deaths" value={this.props.totalDeaths} />
                        <PopUpContentRow img={TotalRecovered} title="Total Recovered" value={this.props.totalRecovered} />
                    </div>
                    <button className="pop-up__button" onClick={() => {this.props.updateData(false)}} >OK</button>
                </div>
            </div>
        )
    }
}

class PopUpContentRow extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="pop-up__content-row">
                <img className="pop-up__content-row-img" src={this.props.img} alt="" />
                <p>{this.props.title}</p>
                <p>{this.props.value}</p>
            </div>
        )
    }
}



render(<App />,document.getElementById('app'))

