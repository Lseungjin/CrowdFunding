import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../utils/AppContext'
import "./sidebar.css"
import { generateRandomAvatar } from 'seedable-random-avatar-generator';

const RightSideBar = () => {

    const { accounts, web3 } = useContext(AppContext)
    const [balance, setBalance] = useState(0)
    const handleDisconnect = () => {
        localStorage.removeItem('cacheKey')
        localStorage.removeItem('cacheNID')
        window.location.href = "/login"
    }

    useEffect(() => {
        const showBalance = () => {
            web3.eth.getBalance(accounts[0], (err, bal) => {
                let bl = web3.utils.fromWei(bal, "ether")
                bl = Math.floor(bl)
                setBalance(bl)
            });
        }
        showBalance()
    }, [web3, accounts])

    return (
        <div className="right-side-bar sidebar">

            <div className="acc-details">
                <div className="acc">
                    <img width={50} src={generateRandomAvatar(accounts[0])} alt="/" />
                    <div className="details">
                        <p>{accounts[0]}</p>
                        <p className="balance">{balance} ETH</p>
                    </div>
                </div>
            </div>

            <ul>
                <li><button className="disconnect-btn" onClick={handleDisconnect}>지갑 연결 해체</button></li>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/all">모든 프로젝트 조회</Link></li>
                <li><Link to="/projects/my">나의 프로젝트 조회</Link></li>
                <li><Link to="/projects/funded">참여한 프로젝트 조회</Link></li>
                <li><Link to="/create">프로젝트 생성</Link></li>
            </ul>
        </div>
    )
}

export default RightSideBar
