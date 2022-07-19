import React, { useState } from "https://esm.sh/react@18.2.0";
import { Link } from "https://esm.sh/react-router-dom@5.2.0";
import { fetchSinceWords } from "./getSinceWords.jsx";

const Shiritori = () => {
    const [word,setWord] = useState("")
    const [resSentence,setResSentence] = useState("")
    const handleWord = (e) => {
        setWord(e.target.value);
        setResSentence("");
    }
    const {data} = fetchSinceWords("world")
    if(!data) return(<div>loading...</div>);
    const inputCheck = (e) => {
        e.preventDefault()
        if(word.length === 0) return 
        if(word.length > 20){
            setResSentence("文字数が大きすぎます 20文字以内で入力してください")
            return;
        }
        const grep =  /^[\u{3000}-\u{301C}\u{3041}-\u{3093}\u{309B}-\u{309E}]+$/mu;
        if(!grep.test(word)){
            setResSentence("ひらがなのみで入力してください")
            return;
        }
        if(data["words"].length !== 0){
            if(data["words"].slice(-1)[0].slice(-1)[0] !== word.slice(0,1)){
                setResSentence("しりとりが成立していません")
                return
            }
        }
        pushNextWord()
        setWord("")
    }
    const handleReset = async () => {
        await fetch("/delete/world", {
            mode: 'cors',
            method: "DELETE",
            headers: {"Access-Control-Allow-Origin": "*" }
        });
    }
    const pushNextWord = async () => {
        const response = await fetch("/nextword", {
            mode: 'cors',
            method: "POST",
            headers: { "Content-Type": "application/json","Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ word,id:"world" })
        });
        //console.log(response.ok)
        //console.log(await response.json())
    }
    return (<div>
        <Link to="/" className="back" ><img src="https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_modoru_16.png" /></Link>
        <form onSubmit={inputCheck} >
            <input className="wordInput" id="nextWordInput" type="text" value={word} onChange={handleWord}/>
        </form>
        <p className="alert">{resSentence}</p>
        <div className="words">
            {data["words"].map(word => (
                <div className="shiritori-word">
                    <div className="shiritoriword" key={word}>{word}</div>
                    <div className="arrow">→</div>
                </div>
            ))}
        </div>
        <div className="reset"><button className="reset-btn" onClick={handleReset}>Reset</button></div>
    </div>)
}

export default Shiritori;