import React, { useState } from 'react'
import "./style.css"
import MetamaskPNG from "../../assets/metamask.png"

const Header = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="이름"></input>
                        </div>
                        <div className="ip-fields">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="메타마스크 주소"></input>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header
