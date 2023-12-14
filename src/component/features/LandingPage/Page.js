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
                    <h1>크라우드 펀딩</h1>
                    <p>'박박이'팀이 진행하는 SNS형 크라우드 펀딩 프로젝트입니다.</p>
                    <p>블록체인 기술을 접목시킨 크라우드 펀딩을 경험해보세요!</p>
                    <p>sepoliaETH가 필요합니다.</p>
                    <p>https://sepoliafaucet.com/ 이 사이트에서 하루에 한번 0.5sepoliaETH를 얻을 수 있습니다.</p>
                    <Link to="/all" className="start-btn">시작하기</Link>
                    <a href="https://funs.vercel.app/" className="start-btn">돌아가기</a> {/* "돌아가기" 버튼 추가 */}
                </div>
                <div className="image">
                    <img src={IMAGE} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Page
