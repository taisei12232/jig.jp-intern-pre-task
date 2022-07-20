import React, { useState,useContext } from "https://esm.sh/react@18.2.0";
import {isOpenContext} from "./Home.jsx"
import { Link } from "https://esm.sh/react-router-dom@5.2.0";

const ModalWord = () => {
    const {isOpen,setIsOpen} = useContext(isOpenContext)
    const [watchword,setWatchword] = useState("")
    const [isCorrectInput,setIscorrectInput] = useState(false)
    if(isOpen === false){
        return null;
    }
    const isClickOutside = () => {
        setIsOpen(false)
    }
    const handleModal = (e) => {
        e.stopPropagation();
    }
    const handleWatchword = (e) => {
        setWatchword(e.target.value)
        if(e.target.value.length > 0 && e.target.value.length < 50){
            setIscorrectInput(true)
        }
        else{
            setIscorrectInput(false)
        }
    }
    //const {data} = fetchSinceWords(watchword);
    //console.log(data)

    return (
        <div className="component-modal-watchword" onClick={isClickOutside}>
            <div className="modal-watchword" onClick={handleModal}>
                <p>合言葉を入力してね</p>
                <input type="text" className="inputwatchword" value={watchword} autoComplete="off" onChange={handleWatchword}></input>
                {isCorrectInput && <Link to={`/private?watchword=${watchword}`} className="submit-wraper"><button className="btn-room-submit">入室する！</button></Link>}
            </div> 
        </div>
    )
}

export default ModalWord;