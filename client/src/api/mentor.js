import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("authData")) {
        req.headers.Authorization = `Bearer ${
            JSON.parse(localStorage.getItem("authData")).auth_token
        }`;
    }

    return req;
});

export const signIn = (fields) => API.post("/mentor/login", fields);
export const signUp = (fields) =>
    API.post("/mentor/signup", fields).catch((error) => {
        return error.response;
    });
export const fetchMentor = () =>
    API.get("/mentor/dashboard").catch((error) => {
        return error.response;
    });
export const fetchUserDetailsOfPosts = (authorId) =>
    API.get(`/user/${authorId}`).catch((error) => {
        return error.response;
    });
export const fetchAllMentorPost = () =>
    API.get("/mentor/fetchAllPosts").catch((error) => {
        return error.response;
    });
