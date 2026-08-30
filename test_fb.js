import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1GZwecQgGuUSHpar-EysDr-H6SS06T-8",
  authDomain: "web-bem-ums.firebaseapp.com",
  projectId: "web-bem-ums"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const querySnapshot = await getDocs(collection(db, "cms"));
    console.log("Docs found:", querySnapshot.docs.length);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", "has data");
    });
    process.exit(0);
  } catch(e) {
    console.error("Error reading:", e.message);
    process.exit(1);
  }
}
test();
