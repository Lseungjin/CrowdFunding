import React, { useState, useEffect, useCallback } from 'react';
import Web3 from "web3";
import CrowdFunding from './build/contracts/CrowdFunding.json';

import Project from "./build/contracts/Project.json"
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import "./App.css";
import { AppContext } from "./component/utils/AppContext";
import CreateProject from "./component/features/Create/CreateProject";
import AllProjects from "./component/features/View/AllProjects";
import MyProjects from "./component/features/View/Projects/MyProjects"
import Page from "./component/features/LandingPage/Page";
import Login from "./component/features/Auth/Login";
import FundedProjects from "./component/features/View/FundedProjects/FundedProjects";

const App = () => {
  const [web3, setWeb3] = useState(new Web3(window.ethereum))
  const [accounts, setAccounts] = useState([])
  const [contract, setContract] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  console.log(projects)

  useEffect(() => {
    const connect = async () => {
      const pk = localStorage.getItem('cacheKey')
      const nId = localStorage.getItem('cacheNID')
      try {
        if (pk && nId) {
          const web3 = new Web3(window.ethereum)
          console.log(pk)
          const accounts = !pk || pk === undefined ? [] : [pk];
          const networkId = nId;
          console.log(networkId)

          const deployedNetwork = CrowdFunding.networks[networkId];
          const instance = new web3.eth.Contract(
            CrowdFunding.abi,
            deployedNetwork && deployedNetwork.address,
          )

          localStorage.setItem("cacheKey", accounts[0]);

          setWeb3(web3)
          setAccounts(accounts)
          setContract(instance)
          setLoading(false)
        }
        else {
          setLoading(false)
        }
      }

      catch (error) {
        setLoading(false)
        console.error(error);
      }
    }
    connect()
  }, [])


  const crowdfundProject = useCallback((address) => {
    const instance = new web3.eth.Contract(Project.abi, address);
    return instance;
  }, [web3]);

  const isExpired = useCallback((project) => {
    let d = new Date().setUTCHours(0, 0, 0, 0) / 1000;
    let pd = Number(project.deadline);
    return !(d <= pd);
  }, []);

  const isComplete = useCallback((project) => {
    return project.currentState === '2';
  }, []);

  const getAllProjects = useCallback(() => {
    contract.methods.returnAllProjects().call().then((pr) => {
      pr.forEach(async (projectAddress) => {
        const projectInst = crowdfundProject(projectAddress);
        await projectInst.methods.getInfo().call()
          .then((projectData) => {
            const projectInfo = projectData;
            projectInfo.isLoading = false;
            projectInfo.contract = projectInst;
            if (!isExpired(projectInfo) && !isComplete(projectInfo)) {
              setProjects(p => [...p, projectInfo])
            }
          })
      });
    });
  }, [contract, crowdfundProject, isExpired, isComplete, setProjects]);

  useEffect(() => {
    if (web3 !== undefined && accounts !== undefined && contract) {
      getAllProjects();
    }
  }, [web3, accounts, contract, getAllProjects]);


  const values = {
    setWeb3,
    setAccounts,
    setContract,
    web3,
    accounts,
    contract,
    crowdfundProject,
    projects,
    setProjects
  }


  if (typeof web3 === 'undefined') {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  else if (loading) {
    return <p>Loading....</p>
  }
  else {
    return (
      <AppContext.Provider value={values}>
        <div className="App">
          <Router>
            <Switch>
              {accounts.length < 1 && <Redirect from="/all" to="/login" />}
              {accounts.length < 1 && <Redirect from="/create" to="/login" />}
              {accounts.length < 1 && <Redirect from="/projects/my" to="/login" />}

              <Route path="/" exact component={Page} />
              <Route path="/all" component={AllProjects} />
              <Route path="/create" component={CreateProject} />
              <Route path="/projects/my" component={MyProjects} />
              <Route path="/projects/funded" component={FundedProjects} />
              <Route path="/login" exact component={Login} />
            </Switch>
          </Router>
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;