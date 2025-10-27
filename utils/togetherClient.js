import axios from "axios";

export const togetherClient = axios.create({
  baseURL: "https://api.together.xyz/v1",
  headers: {
    "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
    "Content-Type": "application/json"
  }
});
