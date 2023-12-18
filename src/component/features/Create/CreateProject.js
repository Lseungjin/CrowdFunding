import React, { useContext, useState } from 'react';
import "./style.css";
import { AppContext } from '../../utils/AppContext';
import { Link } from 'react-router-dom';

const CreateProject = (props) => {
    const { web3, accounts, contract, crowdfundProject } = useContext(AppContext)

    const [project, setProject] = useState({
        title: '',
        description: '',
        duration: '',
        amountGoal: '',
        image: null
    });

    const create = async (e) => {
        e.preventDefault()
        if (project.title !== '' &&
            project.description !== '' &&
            project.duration &&
            project.amountGoal &&
            project.image) {

            contract.methods.startProject(
                encodeURI(project.title),
                encodeURI(project.description),
                project.duration,
                web3.utils.toWei(project.amountGoal, 'ether')
            ).send({ from: accounts[0] })
            .then(res => {
                const projectInfo = res.events.ProjectStarted.returnValues;
                projectInfo.title = decodeURI(projectInfo.title);
                projectInfo.description = decodeURI(projectInfo.description);
                projectInfo.isLoading = false;
                projectInfo.currentState = 0;
                projectInfo.contract = crowdfundProject(projectInfo.contractAddress);
                localStorage.setItem(projectInfo.title, project.image);
                window.location.href = "/projects/my"
            })
        }
        else {
            alert("Fill all the fields.")
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onloadend = () => {
            setProject({ ...project, image: reader.result });
        };

        reader.readAsDataURL(file);
    }

    return (
        <div className="create-container">
            <Link to="/all" className="backto-home">Back</Link>
            <div className="split-container">
                <div className="form-container">
                    <form onSubmit={create}>
                        <h2 className="heading">프로젝트 생성하기</h2>
                        <div className="ip-fields">
                            <input type="file" accept="image/*" onChange={handleImageUpload} />

                            <input placeholder="프로젝트 제목(Project Title)"
                                value={project.title}
                                onChange={(e) => setProject({ ...project, title: e.target.value })} />

                            <input placeholder="기간(Durations, days)"
                                value={project.duration}
                                onChange={(e) => setProject({ ...project, duration: e.target.value })} />
                        </div>

                        <div className="ip-fields">
                            <input placeholder="목표 금액(Goal Amount, ETH)"
                                value={project.amountGoal}
                                onChange={(e) => setProject({ ...project, amountGoal: e.target.value })} />

                            <textarea placeholder="프로젝트 설명(Project Description)"
                                value={project.description}
                                onChange={(e) => setProject({ ...project, description: e.target.value })} />
                        </div>

                        <button>생성(Create)</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;
