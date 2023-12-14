import React, { useState } from 'react'
import "./style.css"
import MetamaskPNG from "../../assets/metamask.png"

const Header = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [nickname, setNickname] = useState('');
    const [validName, setValidName] = useState(false);
    const [metamaskAddress, setMetamaskAddress] = useState('');

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

     // 닉네임 유효성 확인
    async function checkName() {
        // 액세스 토큰 가져오기
        const localStorage = window.localStorage;
        const token = localStorage.getItem("accessToken");
    
        // 닉네임 중복 확인 API
        const nameCheckAPI = `https://funsns.shop:8000/user-service/metamask/${nickname}`;
    
        // fetch API
        let res = await fetch(nameCheckAPI, {
            method: "GET",
            headers: {
                Credentials: "include",
                ContentType: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            if (res.status === 200) {
                alert("유효한 닉네임입니다.");
                setValidName(true);
            } else {
                alert("존재하지 않는 닉네임입니다.");
                setValidName(false);
            }
        })
        .catch((error) => {
            console.log(error);
            throw new Error("서버 요청 실패!");
        });
    }

     // 메타마스크 주소 등록
    async function registerMetamaskAddress() {
        const localStorage= window.localStorage;
        const token = localStorage.getItem("accessToken");

        const registerAPI = `https://funsns.shop:8000/user-service/metamask/address`;

        let res = await fetch(registerAPI, {
            method: "POST",
            headers: {
                Credentials: "include",
                ContentType: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                "nickname": nickname,
                "metamaskAddress": address
            })
        })
        .then((res) => {
            if (res.status === 200) {
                alert("메타마스크 주소가 등록되었습니다.");
            } else {
                alert("메타마스크 주소 등록에 실패하였습니다.");
            }
        })
        .catch((error) => {
            console.log(error);
            throw new Error("서버 요청 실패!");
        });
    }
    return (
        <div className="header-container">
            <div className="search-bar">
                <h1>{props.title}</h1>
                <input
                    type="search"
                    value={props.query}
                    onChange={(e) => props.setQuery(e.target.value)}
                    placeholder="Search Project"></input>
                <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => setShowModal(true)}
                >
                    <img
                        src={MetamaskPNG}
                        width="30" height="30"
                        alt="메타마스크 등록하기 -> 메타마스크 등록시 포인트 지급!"
                    />
                    <p className="clickable-text">{"메타마스크 등록하기 -> 메타마스크 등록시 포인트 지급!"}</p>
                </div>
            </div>
            <div className="tools">
                <div className="sorting">
                    <p>정렬:</p>
                    <select value={0}
                        onChange={(e) => props.setSortingIdx(Number(e.target.value))}>
                        <option value={0}>None</option>
                        <option value={1}>프로젝트 제목</option>
                        <option value={2}>모금 금액</option>
                        <option value={3}>종료일</option>
                    </select>
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>입력 폼</h2>
                        <span className="close-button" onClick={() => setShowModal(false)}>×</span>
                        <div className="ip-fields">
                            <input
                                type="text"
                                value={nickname}
                                onChange={handleNicknameChange}
                                placeholder="닉네임"></input>
                        </div>
                        <button
                            onClick={checkName}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                            닉네임 유효성 확인 버튼
                        </button>
                        <div className="ip-fields">
                            <input
                                type="text"
                                value={metamaskAddress}
                                onChange={(e) => setMetaMaskAddress(e.target.value)}
                                placeholder="메타마스크 주소"></input>
                        </div>
                        <button
                            onClick={registerMetamaskAddress}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                            메타마스크 주소 등록
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header