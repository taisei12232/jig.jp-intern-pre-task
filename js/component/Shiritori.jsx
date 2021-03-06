import React, { useState,useEffect } from "https://esm.sh/react@18.2.0";
import { Link } from "https://esm.sh/react-router-dom@5.2.0";
import { fetchSinceWords } from "./getSinceWords.jsx";

const Shiritori = () => {
    const [word,setWord] = useState("")
    const [resSentence,setResSentence] = useState("")
    const [isLoading,setIsLoading] = useState(false)
    const {data} = fetchSinceWords("world")
    const kogaki = ["ぁ","ぃ","ぅ","ぇ","ぉ","ゃ","ゅ","ょ","ゎ","ゐ","ゑ","を"]
    const big = ["あ","い","う","え","お","や","ゆ","よ","わ","い","え","お"]
    const grep =  /^[\u{3000}-\u{301C}\u{3041}-\u{3093}\u{309B}-\u{309E}\u{30FC}\u{3094}]+$/mu;
    useEffect(() => {
        setIsLoading(false)
    },[data])
    if(!data) return(<div>loading...</div>);
    const handleWord = (e) => {
        if(data["words"].length !== 0){
            if(data["words"].slice(-1)[0].slice(-1)[0] === "ん"){
                setResSentence("最後に「ん」がつきました。Resetを押して最初からやり直してください。")
                setWord("")
                return
            }
            else if(data["words"].slice(-1)[0].slice(-1)[0] === "ー" && data["words"].slice(-1)[0].slice(-2)[0] === "ん"){
                setResSentence("最後に「ん」がつきました。Resetを押して最初からやり直してください。")
                setWord("")
                return
            }
        }
        setWord(e.target.value);
        setResSentence("");
    }
    const inputCheck = (e) => {
        e.preventDefault()
        if(word.length === 0) return 
        if(word.length > 20){
            setResSentence("文字数が大きすぎます 20文字以内で入力してください")
            return;
        }
        if(!grep.test(word)){
            setResSentence("ひらがなのみで入力してください")
            return;
        }
        for(var i = 0;i < word.length-1;i++){
            if(word[i] === "ー" && word[i+1] === "ー"){
                setResSentence("伸ばし棒は連続して使用できません")
                return;
            }
        }
        if(word[0] === "ー"){
            setResSentence("最初の文字に伸ばし棒は使用できません")
            return
        }
        if(data["words"].length !== 0){
            const kogakiIndex = kogaki.findIndex(element => element === data["words"].slice(-1)[0].slice(-1)[0])
            const kogakiIndex2 = kogaki.findIndex(element => element === data["words"].slice(-1)[0].slice(-2)[0])
            if(kogakiIndex != -1){
                if(big[kogakiIndex] !== word[0] && data["words"].slice(-1)[0].slice(-1)[0] !== word[0]){
                    setResSentence("しりとりが成立していません")
                    return
                }
            }
            else if(data["words"].slice(-1)[0].slice(-1)[0] === "ー"){
                if(kogakiIndex != -1){
                    if(big[kogakiIndex2] !== word[0]){
                        setResSentence("しりとりが成立していません")
                        return
                    }
                }
                else if(data["words"].slice(-1)[0].slice(-2)[0] !== word[0] && kogakiIndex2 == -1){
                    setResSentence("しりとりが成立していません")
                    return
                }
            }
            else if(data["words"].slice(-1)[0].slice(-1)[0] !== word[0]){
                setResSentence("しりとりが成立していません")
                return
            }
        }
        if(data["words"].some(a => a === word)){
            setResSentence("既に使われている単語です")
            return
        }
        setIsLoading(true)
        pushNextWord()
        setWord("")
    }
    const handleReset = async () => {
        await fetch("/delete/world", {
            mode: 'same-origin',
            method: "DELETE"
        });
        setResSentence("")
    }
    const pushNextWord = async () => {
        const response = await fetch("/nextword", {
            mode: 'same-origin',
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word,id:"world" })
        });
        //console.log(response.ok)
        //console.log(await response.json())
    }
    return (<div>
        <Link to="/" className="back" ><img src="https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_modoru_16.png" /></Link>
        <form onSubmit={inputCheck} >
            <input className="wordInput" id="nextWordInput" type="text" autoComplete="off" value={word} onChange={handleWord}/>
        </form>
        <p className="alert">{resSentence}</p>
        <div className="words">
            {data["words"].map(word => (
                <div className="shiritori-word">
                    <div className="shiritoriword" key={word}>{word}</div>
                    {word.slice(-1)[0] === "ん" || (word.slice(-1)[0] === "ー" && word.slice(-2)[0] === "ん") ? <div className="arrow">❌</div>
                        : <div className="arrow">→</div>}
                </div>
            ))}
            {isLoading &&<div className="shiritori-word">
                <div className="shiritoriword" key={"loading"}>loading...</div>
            </div>}
        </div>
        <div className="reset"><button className="reset-btn" onClick={handleReset}>Reset</button></div>
    </div>)
}

export default Shiritori;