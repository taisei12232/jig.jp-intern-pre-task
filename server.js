import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import { basename, dirname } from "https://deno.land/std@0.130.0/path/mod.ts";
// @deno-types="https://cdn.esm.sh/v57/firebase@9.4.1/app/dist/app/index.d.ts"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
// @deno-types="https://cdn.esm.sh/v58/firebase@9.4.1/firestore/dist/firestore/index.d.ts"
import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    getFirestore,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"

const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//console.log("Listening on http://localhost:8080");

serve(async (req) => {
  //console.log(ip.address())
  const kogaki = ["ぁ","ぃ","ぅ","ぇ","ぉ","ゃ","ゅ","ょ","ゎ","ゐ","ゑ","を"]
  const big = ["あ","い","う","え","お","や","ゆ","よ","わ","い","え","お"]
  const pathname = new URL(req.url).pathname;
  //console.log(req.url)
  if (req.method === "GET" && dirname(pathname) === "/watchword") {
    const docRef = doc(db, "shiritori", decodeURI(basename(pathname)));
    const response = await getDoc(docRef)
    if(!response.exists()){
      const FirstRef = doc(db, "firstWords", "words");
      const firstRes = await getDoc(FirstRef)
      const firestWords = firstRes.data()
      await setDoc(docRef,{words:[firestWords["words"][Math.floor(Math.random() * firestWords["words"].length)]]})
    }
    //console.log(response.data())
    return new Response(JSON.stringify(response.data()), {
        headers: {
            "content-type": "application/json"
        }
    });
  }
  else if(pathname === "/nextword" && req.method === "POST"){
      const reqJson = await req.json()
      //console.log(reqJson.id)
      const docRef = doc(db, "shiritori", reqJson.id);
      const response = await getDoc(docRef)
      const data = response.data()
      const kogakiIndex = kogaki.findIndex(element => element === data.words.slice(-1)[0].slice(-1)[0])
      const kogakiIndex2 = kogaki.findIndex(element => element === data.words.slice(-1)[0].slice(-2)[0])
      if(data.words.length === 0){
        data.words.push(reqJson.word)
        //console.log(data)
        await updateDoc(docRef,{words:data.words})
      }
      else if(data.words.slice(-1)[0].slice(-1)[0] === reqJson.word[0]){
        data.words.push(reqJson.word)
        //console.log(data)
        await updateDoc(docRef,{words:data.words})
      }
      else if(kogakiIndex != -1 || kogakiIndex2 != -1){
        if(data.words.slice(-1)[0].slice(-1)[0] === "ー"){
          if(data.words.slice(-1)[0].slice(-2)[0] === reqJson.word[0]){
            data.words.push(reqJson.word)
            await updateDoc(docRef,{words:data.words})
          }
          if(big[kogakiIndex2] === reqJson.word[0]){
            data.words.push(reqJson.word)
            await updateDoc(docRef,{words:data.words})
          }
        }
        else if(big[kogakiIndex] === reqJson.word[0]){
          data.words.push(reqJson.word)
          await updateDoc(docRef,{words:data.words})
        }
      }
      else if(data.words.slice(-1)[0].slice(-1)[0] === "ー" && data.words.slice(-1)[0].slice(-2)[0] === reqJson.word[0]){
        data.words.push(reqJson.word)
        await updateDoc(docRef,{words:data.words})
      }
      //console.log("Why?")
      return new Response("200", {
          headers: {
              "content-type": "application/json"
          }
      });
  }
  else if(dirname(pathname) === "/delete" && req.method === "DELETE") {
    const docRef = doc(db, "shiritori", decodeURI(basename(pathname)));
    const FirstRef = doc(db, "firstWords", "words");
    const firstRes = await getDoc(FirstRef)
    const firestWords = firstRes.data()
    await setDoc(docRef,{words:[firestWords["words"][Math.floor(Math.random() * firestWords["words"].length)]]})
    return new Response(200)
  }
  else if(pathname === "/public" || pathname === "/private"){
    //console.log(pathname)
    return new Response(await Deno.readTextFile("./dist/index.html"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
  if(pathname === "/"){
    console.log(req)
  }
  return serveDir(req, {
    fsRoot: "dist",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
    quiet: true
  });
});
