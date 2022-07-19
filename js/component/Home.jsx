import React, { useState, createContext } from "https://esm.sh/react@18.2.0";
import { Link } from "https://esm.sh/react-router-dom@5.2.0";
import ModalWord from "./ModalWatchword.jsx";

export const isOpenContext = createContext()
const Home = () => {
    const [isOpen,setIsOpen] = useState(false)
    const handlePrivate = () => {
        setIsOpen(!isOpen)
    }
    return (<div className="component-home">
        <h1 className="home-title">しりとり</h1>
        <div className="btn-wrap">
            <Link className="btn-public" to="/public">
                <button className="btn-public">世界中のみんなと</button>
            </Link>
            <button className="btn-private" onClick={handlePrivate}>気心の知れた友達と</button>
        </div>
        <isOpenContext.Provider value={{isOpen,setIsOpen}}>
            <ModalWord />
        </isOpenContext.Provider>
        <div></div>
    </div>)
}

export default Home;