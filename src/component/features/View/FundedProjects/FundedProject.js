import React, { useState, useContext, useEffect } from 'react'
import FundModal from '../../../modals/FundModal'
import RefundModal from '../../../modals/RefundModal'
import { AppContext } from '../../../utils/AppContext'

const FundedProject = ({ project, accounts, web3, pIndex }) => {

    const { projects, setProjects } = useContext(AppContext)
    const [amount, setAmount] = useState(null)
    const [funding, setFunding] = useState(0)
    const [open, setOpen] = useState(false)
    const [rOpen, setROpen] = useState(false)
    const projectImage = localStorage.getItem(decodeURI(project.title));
    console.log(projectImage);

    const getDate = (date) => {
        let d = new Date(date * 1000)
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
    }

    useEffect(() => {
        const getFundingAmount = () => {
            let projectContract = project.contract
            projectContract.methods.contributions(accounts[0]).call()
                .then(res => setFunding(Number(res)))
        }

        if (project) {
            getFundingAmount()
        }

    }, [accounts, project])

    const fundProject = () => {
        let projectContract = project.contract
        project.isLoading = true

        projectContract.methods.contribute().send({
            from: accounts[0],
            value: amount,
        }).then(res => {
            const newTotal = parseInt(res.events.FundReceived.returnValues.currentTotal, 10);
            const projectGoal = parseInt(project.goalAmount, 10);

            project = { ...project, currentAmount: newTotal, isLoading: false }
            if (newTotal >= projectGoal) {
                project.currentState = 2;
            }

            let np = projects
            np[pIndex] = project
            setProjects(np)
            window.location.reload()

        })
    }

    const refund = () => {
        let projectContract = project.contract
        projectContract.methods.getRefund().send({
            from: accounts[0]
        }).then(res => {
            window.location.reload()
        })
    }

    const fundedPercentage = (fund) => {
        let total = Number(project.goalAmount)
        fund = Number(fund)
        let p = (fund / total) * 100
        return p
    }

    const ethValue = (wei) => {
        let res = web3.utils.fromWei(wei, 'ether')
        return res
    }
    const getDiff = (w1, w2) => {
        w1 = Math.floor(Number(web3.utils.fromWei(w1, 'ether')))
        w2 = Math.floor(Number(web3.utils.fromWei(w2, 'ether')))
        return Math.abs(w1 - w2)
    }

    return (
        <div className="project-card">
            <h3>{decodeURI(project.projectTitle)}</h3>
            {projectImage && <img src={projectImage} alt={decodeURI(project.title)} />}
            <div className="top-tile">
                <div className="funded">
                    <img className="ethIcon" src="https://img.icons8.com/fluent/48/000000/ethereum.png" alt="Ethereum Icon" />
                    <p>{ethValue(project.currentAmount)}</p>
                </div>
            </div>
            <p id="desc">{decodeURI(project.projectDesc)}</p>
            <p id="deadline">프로젝트 마감일: {getDate(project.deadline)}</p>
            <p id="raised">목표 금액:
                <span><img className="ethIcon" src="https://img.icons8.com/fluent/48/000000/ethereum.png" alt="Ethereum Icon" />
                    {ethValue(project.goalAmount)}</span></p>
            <p className="your-funds">
                나의 모금액: <span><img className="ethIcon" src="https://img.icons8.com/fluent/48/000000/ethereum.png" alt="Ethereum Icon" />
                </span>
                {ethValue(String(funding))}
            </p>
            <div className="funding-bar">
                <div className="cur" style={{ width: `${fundedPercentage(funding)}%` }}>
                    <p className="lbl">Yours: {ethValue(String(funding))} ETH</p>
                </div>
                <div className="others"
                    style={{ width: `${fundedPercentage(Number(project.currentAmount) - Number(funding))}%` }}>
                    <p className="lbl">Others: {getDiff(project.currentAmount, String(funding))} ETH</p>
                </div>
                <div className="blank"
                    style={{ width: `${fundedPercentage(Number(project.goalAmount) - Number(project.currentAmount))}%` }}>
                    <p className="lbl">남은 금액: {getDiff(project.goalAmount, project.currentAmount)} ETH</p>
                </div>
            </div>
            <div className={`fund-options ${funding !== 0 ? 'flex' : ''}`}>
                <button onClick={() => setOpen(true)}>펀딩</button>
                {funding !== 0 && <button onClick={() => setROpen(true)}>환불</button>}
            </div>

            {open &&
                <FundModal
                    setOpen={setOpen}
                    setAmount={setAmount}
                    amount={amount}
                    fund={fundProject}
                    title={decodeURI(project.projectTitle)}
                    desc={decodeURI(project.projectDesc)}
                    targetAmt={project.goalAmount}
                    curAmt={project.currentAmount}
                    project={project} />}

            {rOpen && (
                <RefundModal
                    setROpen={setROpen}
                    project={project}
                    refund={refund}
                />
            )}
        </div>
    )
}

export default FundedProject

