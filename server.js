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
console.log("Listening on http://localhost:8080");

serve(async (req) => {

  const pathname = new URL(req.url).pathname;
  console.log(req)
  if (req.method === "GET" && dirname(pathname) === "/watchword") {
    const docRef = doc(db, "shiritori", decodeURI(basename(pathname)));
    const response = await getDoc(docRef)
    if(!response.exists()){
      setDoc(docRef,{words:[]})
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
      console.log(reqJson.id)
      const docRef = doc(db, "shiritori", reqJson.id);
      const response = await getDoc(docRef)
      const data = response.data()
      data.words.push(reqJson.word)
      console.log(data)
      await updateDoc(docRef,{words:data.words})
      return new Response("200", {
          headers: {
              "content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
          }
      });
  }
  else if(dirname(pathname) === "/delete" && req.method === "DELETE") {
    const docRef = doc(db, "shiritori", decodeURI(basename(pathname)));
    updateDoc(docRef,{words:[]})
    return new Response(200)
  }
  return serveDir(req, {
    fsRoot: "dist",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});