import React, { useContext } from 'react'
import "./style.css"
import CancelIcon from '@material-ui/icons/Cancel';
import { AppContext } from '../utils/AppContext';


const FundModal = (props) => {

    const { setOpen, amount, setAmount, fund, targetAmt, curAmt, project } = props
    // project에서 title과 desc를 가져옵니다.
    const { projectTitle, projectDesc } = project;
    const title = decodeURI(projectTitle);
    const desc = decodeURI(projectDesc);
    const { web3 } = useContext(AppContext)



    const ethValue = (wei) => {
        let res = web3.utils.fromWei(wei, 'ether')
        return res
    }
    const canFund = ethValue(targetAmt) - ethValue(curAmt)

    const handleSubmit = (e) => {
        e.preventDefault();
        fund();
    }
    const projectImage = localStorage.getItem(decodeURI(project.title));

    if (!project) {
        return null;
      }
    return (
        <div className="modal-container">
            <div className="modal-box">
                <h2>프로젝트 펀딩하기</h2>
                <CancelIcon className="close-icon" onClick={() => setOpen(false)} />
                <h4 className="pr-title">프로젝트 제목 : {title}</h4>
                {projectImage && <img src={projectImage} alt={decodeURI(project.title)} style={{ width: '200px', height: 'auto' }} />}


                <p className="pr-desc">프로젝트 내용 : {desc}</p>
                <p className="fund-modal">남은 모금액: <span>{canFund} ETH</span></p>

                <form onSubmit={handleSubmit}>
                    <input placeholder="수량을 입력해주세요"
                        className="pr-fund"
                        value={amount ? amount : ''}
                        onChange={(e) => {
                            let eth = Number(e.target.value)
                            if (eth <= canFund) {
                                setAmount(e.target.value)
                            }
                            else {
                                alert(`모금액 이상의 자금을 펀딩할 수 없습니다.`)
                            }

                        }}>
                    </input>
                    <button className="pr-fund-btn" type="submit">펀딩하기</button>
                </form>
            </div>
        </div>
    )
}

export default FundModal
