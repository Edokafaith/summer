import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { useState, useEffect, useCallback } from "react";




import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import IERC from "./contract/IERC.abi.json";
import Summer from  './contract/Summer.abi.json';
import Events from './components/Events';
import NewEvent from './components/NewEvent';


const ERC20_DECIMALS = 18;


const contractAddress = "0x944878fC6A1f111f36BB3D698694a706841b6735";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";




function App() {

  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [events, setEvents] = useState([]);

  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error Occurred");
      
     }
   };
 
    
   const getBalance = (async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
      const contract = new kit.web3.eth.Contract(Summer, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  });

 
   
   const getEvent =  async () => {
     const eventsLength = await contract.methods.geteventsLength().call();
     console.log(eventsLength);
     const _eventt = []
     for (let index = 0; index < eventsLength; index++) {
       console.log(eventsLength);
       let _events = new Promise(async (resolve, reject) => {
       let _event = await contract.methods.getEvent(index).call();
        const event = _event[0]
       resolve({
        index: index,
        owner: event[0],
        image: event[1],
        theme: event[2],
         venue: event[3],
         price: event[4],
       interested: event[5]
       
                 
      });
    });
    _eventt.push(_events);
  }
  const _events = await Promise.all(_eventt);
  console.log(_events)
  setEvents(_events);
  console.log(events)
  
};


useEffect(() => {
  connectToWallet();
}, []);

useEffect(() => {
  if (kit && address) {
    getBalance();
   
  }
}, [kit, address]);

useEffect(() => {
  if (contract) {
    getEvent();
  }
}, [contract]);  


const addEvent = async (
  _image,
  _theme,
  _venue,
  price
) => {

  const _price = new BigNumber(price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods
        .addEvent(_image, _theme, _venue, _price)
        .send({ from: address });
       getEvent();
    } catch (error) {
      console.log(error);
    }
  };

  const ChangeVenue = async (_index, _newVenue) => {
    console.log(_index);
    try {
      await contract.methods.ChangeVenue(_index, _newVenue).send({ from: address });
      getEvent();
      getBalance();
    } catch (error) {
     console.log(error);
     alert("The Event venue has been changed")
    }};

    const interested = async (_index) => {
      try {
        await contract.methods.Interested(_index).send({ from: address });
        getEvent ();
        getBalance();
      } catch (error) {
        alert.log(error);
      }};


      
  const bookEvent = async (_index,) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
    
      
      await cUSDContract.methods
        .approve(contractAddress, events[_index].price)
        .send({ from: address });
      await contract.methods.bookEvent(_index).send({ from: address });
      getEvent();
      getBalance();
    } catch (error) {
      console.log(error)
    }};

  



  return (
    <div>
      <Navbar balance = {cUSDBalance} />
      <Events events ={events}
      bookEvent = {bookEvent}
      ChangeVenue = {ChangeVenue}
      interested = {interested}
      onlyOwner={address}
       
       
      
       
      />
       <NewEvent addEvent = {addEvent}
       
/>
    </div>
    )
  }

export  default App;
