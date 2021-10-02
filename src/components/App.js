import React, { Component, useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./App.css";
import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import Web3 from "web3";
import Main from './Main'

function App() {
  let [account, setAccount] = useState("");
  let [daiToken, setdaiToken] = useState({});
  let [dappToken, setdappToken] = useState({});
  let [tokenFarm, settokenFarm] = useState({});
  let [daiTokenBalance, setdaiTokenBalance] = useState("0");
  let [dappTokenBalance, setdappTokenBalance] = useState("0");
  let [stakingBalance, setstakingBalance] = useState("0");
  let [loading, setloading] = useState(true);
  const loabWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum Browser Detected");
    }
  };
  const init = async () => {
    await loabWeb3();
    await loadBlockChainData();
  };
  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount((account = accounts[0]));
    const networkId = await web3.eth.net.getId();
    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      setdaiToken(
        (daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address))
      );
      setdaiTokenBalance(
        (daiTokenBalance = (
          await daiToken.methods.balanceOf(account).call()
        ).toString())
      );
      console.log(daiTokenBalance);
    } else {
      window.alert("Dai Token contract not deployed to detected network");
    }
    const dappTokenData = DappToken.networks[networkId];
    if (dappTokenData) {
      setdappToken(
        (dappToken = new web3.eth.Contract(
          DappToken.abi,
          dappTokenData.address
        ))
      );
      setdappTokenBalance(
        (dappTokenBalance = (
          await dappToken.methods.balanceOf(account).call()
        ).toString())
      );
      console.log(dappTokenBalance);
    }
    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      settokenFarm(
        (tokenFarm = new web3.eth.Contract(
          TokenFarm.abi,
          tokenFarmData.address
        ))
      );
      setstakingBalance(
        (stakingBalance = (
          await tokenFarm.methods.stakingBalance(account).call()
        ).toString())
      );
      console.log(stakingBalance);
      setloading(false)
    }
  };
  const stakeTokens = (amount) => {
setloading(true)     
    daiToken.methods.approve(tokenFarm._address, amount).send({ from: account }).on('transactionHash', (hash) => {
      tokenFarm.methods.stakeToken(amount).send({ from: account }).on('transactionHash', (hash) => {
setloading(false)     
 })
    })
  }

  const unstakeTokens = (amount) => {
    setloading(true)
    tokenFarm.methods.unStakeToken().send({ from: account }).on('transactionHash', (hash) => {
setloading(false)    
})
  }
  useEffect(() => {
    init();
  }, []);
  return (
    <div>
      <Navbar account={account} />
      {loading?(
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >Loading</main>
          </div>
        </div>
      ):<Main
          daiTokenBalance={daiTokenBalance}
        dappTokenBalance={dappTokenBalance}
        stakingBalance={stakingBalance}
          stakeTokens={stakeTokens}
           unstakeTokens={unstakeTokens}
      />}
      
    </div>
  );
}

export default App;
