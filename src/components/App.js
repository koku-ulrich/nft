import React, { Component } from 'react';
import Web3 from 'web3'
import Maison from '../smartcontracts/abis/Maison.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    console.log('networkId : ' + networkId)
    const networkData = Maison.networks[networkId]
    if(networkData) {
      const abi = Maison.abi
      const address = networkData.address
      console.log('adresse : ' + address)
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load maison image
      for (var i = 1; i <= totalSupply; i++) {
        const maison = await contract.methods.maisons(i - 1).call()
        this.setState({
          maison: [...this.state.maisons, maison]
        })
      }
      console.log('colors : ' + this.state.maisons)
      
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  createMaison = (maison) => {
    this.state.contract.methods.createMaison(maison).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        maisons: [...this.state.maisons, maison]
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      balance: '',
      account: '',
      contract: null,
      totalSupply: 0,
      maisons: []
    }
  }

  render() {
    return (
      <div>
        <nav className="menu navbar navbar-dark fixed-top bg-white flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://localhost:3000/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fab fa-btc"></i> <span className='nav-links text-body'>  Validate Coin </span>
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small>Compte : <span id="account" className="text-primary">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Creer un token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const maison = this.maison.value
                  this.createMaison(maison)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => { this.maison = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.maisons.map((maison, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: maison }}></div>
                  <div>{maison}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
