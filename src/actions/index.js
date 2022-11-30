import { auth, provider, storage } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from "./actionType";
import db from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  Timestamp,
  orderBy,
  query,
  getDocs,
} from "firebase/firestore";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
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
    dispatch(setLoading(true));

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
            dispatch(setLoading(false));
            console.log("Document written with ID: ", docRef.id);
          });
        }
      );
    } else if (payload.video) {
      const docRef = collection(db, "articles");
      addDoc(docRef, {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: Timestamp.now(),
          image: payload.user.photoURL,
        },
        video: payload.video,
        sharedImg: "",
        comments: 0,
        description: payload.description,
      });
      dispatch(setLoading(false));
    }
  };
}

export function getArticlesAPI() {
  return async (dispatch) => {
    let payload = [];
    const docRef = collection(db, "articles");
    const q = query(docRef, orderBy("actor.date", "desc"));
    const qsnapshot = await getDocs(q);
    qsnapshot.forEach((doc) => {
      payload.push(doc.data());
    });
    dispatch(getArticles(payload));
  };
}
