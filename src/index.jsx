import '@/styles/style'
import React from 'react'
import {render} from 'react-dom'
// const data = getData()



class App extends React.Component { 
    render(){
        return (
            <div className="container">
                <Header />
                <Main />
            </div>
        )
    }
}

class Header extends React.Component {
    render() {
        return(
            <header className="header">
                <div className="header__logo-box">
                    <div className="header__logo"></div>     
                    <h1 className="header__logo-title">STATISTIC</h1>
                </div>
                <div className="header__search-box">
                    <input className="header__search" type="text" placeholder="Search..." />
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
            dataGlobal: []
        }
        this.getData()
    }

    getData(){
        fetch('https://api.covid19api.com/summary').then(
            (res) => res.json()
        ).then(
            allData => {
                this.setState({data: allData, dataCountrys: allData.Countries, dataGlobal: allData.Global})
        })
    }



    render(){    
        console.log(this.state.dataCountrys)
        return(
            <main className="main">
                <ul className="main__list">
                    <ListItem title={true}/>
                    <div className="main__list-content" id="mainListContent">
                        {this.state.dataCountrys.map((country,i) => (<ListItem key={i} index={i+1} country={country.Country} total={country.TotalConfirmed} />))}
                    </div>
                </ul>
            </main>
        )
    }
}

class ListItem extends React.Component {
    constructor (props){
        super(props)
        this.className = 'main__list-item '
        this.index = this.props.index
        this.country = this.props.country
        this.total = this.props.total
        if(this.props.title){
            this.className += 'main__list-item_title'
            this.index = '№'
            this.country = 'Country'
            this.total = 'Total Confirmed'
        }
    }
    render(){
        return (
            <ul className={this.className}>
                <li className="main__list-item-col">{this.index ? this.index : '-'}</li>
                <li className="main__list-item-col_line"></li>
                <li className="main__list-item-col">{this.country ? this.country : '-'}</li>
                <li className="main__list-item-col_line"></li>
                <li className="main__list-item-col">{this.total ? this.total : '-'}</li>
            </ul>
        )
    }
}

render(<App />,document.getElementById('app'))