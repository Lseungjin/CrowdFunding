import React, { useContext } from 'react'
import "./style.css"
import { Link, Redirect } from 'react-router-dom'
import MetamaskPNG from "../../../assets/metamask.png"
import AppPNG from "../../../assets/app.png"
import { AppContext } from '../../utils/AppContext'



const Login = () => {

    const { web3, accounts } = useContext(AppContext)

    const handleConnect = async (e) => {
        e.preventDefault()

        if (!web3 || !web3.utils) {
            alert('Please connect to MetaMask first.');
            console.error('Web3 is not initialized');
            return;
        }

        if (!window.ethereum) {
            console.error('Ethereum provider is not available');
            return;
        }

        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{eth_accounts: {}}]
        });
        const address = await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [{  }]
        })
        let ad = web3.utils.toChecksumAddress(address[0])
        const networkId = await web3.eth.net.getId();
        localStorage.setItem('cacheKey', ad)
        localStorage.setItem('cacheNID', networkId)
        window.location.href = "/all"
    }

    if(accounts && accounts.length > 0){
        return <Redirect to="/all" />
    }

    return (
        <div className="create-container">
            <Link to="/" className="backto-home">돌아가기</Link>
            <div className="split-container">

                <div className="form-container auth">
                    <div className="form">
                        <h2 className="heading">로그인</h2>

                        <div className="login-dg">
                            <img width="60" height="60" src={MetamaskPNG} alt="" />
                            <p>- - - - - - -</p>
                            <img width="60" height="60" src={AppPNG} alt="" />
                        </div>

                        <p className="login-message">메타마스크 연결</p>

                        <div className="flex-container">
                            <button onClick={handleConnect}>메타마스크 연결</button>
                            <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">
                                메타마스크 설치
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login
