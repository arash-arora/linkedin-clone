import { auth, provider, storage } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { SET_USER } from "./actionType";
import db from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export function signInAPI() {
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then((payload) => {
        console.log(payload);
        dispatch(setUser(payload.user));
      })
      .catch((error) => alert(error.message));
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    signOut(auth)
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => console.log(error.message));
  };
}

export function PostArticleAPI(payload) {
  return async (dispatch) => {
    let durl = "";
    if (payload.image !== "") {
      const storageRef = ref(storage, `images/${payload.image.name}`);
      const upload = uploadBytesResumable(storageRef, payload.image).then(
        () => {
          getDownloadURL(storageRef).then(function (url) {
            console.log(url);
            const docRef = collection(db, "articles");
            addDoc(docRef, {
              actor: {
                description: payload.user.email,
                title: payload.user.displayName,
                date: Timestamp.now(),
                image: payload.user.photoURL,
              },
              video: payload.video,
              sharedImg: url,
              comments: 0,
              description: payload.description,
            });
            console.log("Document written with ID: ", docRef.id);
          });
        }
      );
    }
  };
}

// upload.on(
//   "state_changed",
//   (snapshot) => {
//     const progress =
//       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

//     console.log(`progress : ${progress}% `);
//     if (snapshot.state === "RUNNING") {
//       console.log(`Progress: ${progress}%`);
//     }
//     getDownloadURL(upload.snapshot.ref).then((downloadURL) => {
//       durl = downloadURL;
//     });
//   },
// (error) => console.log(error.code),
// async () => {
//   const docRef = collection(db, "articles");

//   console.log("Document written with ID: ", docRef.id);
// }
// );
