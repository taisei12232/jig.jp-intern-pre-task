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
const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//console.log("Listening on http://localhost:8080");

serve(async (req) => {
  
  const pathname = new URL(req.url).pathname;
  //console.log(req)
  console.log(dirname(pathname))
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
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }
    });
  }
  else if(pathname === "/nextword" && req.method === "POST"){
      const reqJson = await req.json()
      //console.log(reqJson.id)
      const docRef = doc(db, "shiritori", reqJson.id);
      const response = await getDoc(docRef)
      const data = response.data()
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
      else if(data.words.slice(-1)[0].slice(-1)[0] === "ー" && data.words.slice(-1)[0].slice(-2)[0] === reqJson.word[0]){
        data.words.push(reqJson.word)
        await updateDoc(docRef,{words:data.words})
      }
      return new Response("200", {
          headers: {
              "content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
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
  else if(dirname(pathname) === "/public" || dirname(pathname) === "/private"){
    console.log(pathname)
    return new Response(await Deno.readTextFile("./dist/index.html"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
  return serveDir(req, {
    fsRoot: "dist",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});