import React, {useContext} from 'react'
import "./style.css"
import { Link } from 'react-router-dom'
import IMAGE from "../../../assets/img.png"
import { AppContext } from '../../utils/AppContext';

const Page = () => {
    const {accounts} = useContext(AppContext) // 'web3' 삭제
    return (
        <div className="landing-page-container">
            <div className="navs">
                <div className="logo">
                    <img src={IMAGE} alt="" width={40}/>
                    <h2>Funs!</h2>
                </div>
                <div className="links">
                    <Link to="/all">All Projects</Link>
                    {accounts.length === 0 ? (
                        <Link to="/login" className="login-btn">Login</Link>
                    ) : <Link to="/projects/my" className="login-btn">펀딩페이지로 이동</Link>}
                    
                </div>
            </div>

            <div className="header">
                <div className="text">
                    <h1>Crowdfunding Applictaion</h1>
                    <p>This is an SNS-type crowdfunding project by the ‘박박이’ team. 
                    This service solves the problems of existing crowdfunding..</p>
                    <Link to="/all" className="start-btn">시작하기</Link>
                </div>
                <div className="image">
                    <img src={IMAGE} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Page
