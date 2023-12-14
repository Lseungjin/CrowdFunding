import React from 'react'
import "./style.css"
import CancelIcon from '@material-ui/icons/Cancel';

const RefundModal = (props) => {

    const { setROpen, project, refund } = props

    const isExpired = () => {
        let d = new Date().getMilliseconds()
        if(d>=project.deadline) return true
        return false
    }

    const getRange = () => {
        let d = new Date().getTime()
        let dif = (Number(project.deadline)*1000 - d) / (1000 * 3600 * 24)
        return Math.floor(dif)
    }

    return (
        <div className="modal-container">
            <div className="modal-box">
                <h2>프로젝트 후원 환불</h2>
                <CancelIcon className="close-icon" onClick={() => setROpen(false)} />
                <h4 className="pr-title">프로젝트 제목 : {project.projectTitle}</h4>
                <p className="pr-desc">프로젝트 내용 : {project.projectDesc}</p>

                {isExpired() ? (
                    <button className="pr-fund-btn" onClick={refund}>Refund</button>
                ) : <p className="exp-msg">이 프로젝트가{getRange()} 일 이내에 완료로 표시되지 않으면 환불하실 수 있습니다. </p>}
            </div>
        </div>
    )
}

export default RefundModal
