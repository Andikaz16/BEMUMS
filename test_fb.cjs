const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, getDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyD1GZwecQgGuUSHpar-EysDr-H6SS06T-8",
  authDomain: "web-bem-ums.firebaseapp.com",
  projectId: "web-bem-ums"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const coreSnap = await getDoc(doc(db, "cms", "core"));
    const articlesSnap = await getDoc(doc(db, "cms", "articles"));
    
    if (coreSnap.exists()) {
      console.log("CORE DATA KEYS:", Object.keys(coreSnap.data()));
      console.log("VisiMisi:", coreSnap.data().visiMisi ? "Exists" : "None");
      console.log("Oprec applicants:", coreSnap.data().oprec?.applicants?.length);
    } else {
      console.log("No core doc!");
    }

    if (articlesSnap.exists()) {
      const articles = articlesSnap.data().data || [];
      console.log("Articles count:", articles.length);
      if (articles.length > 0) {
        console.log("First article title:", articles[0].title);
      }
    }
    process.exit(0);
  } catch(e) {
    console.error(e.message);
    process.exit(1);
  }
}
test();
