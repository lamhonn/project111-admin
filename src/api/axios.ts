import axios from "axios";
import { demoAdapter } from "./mock/adapter";

export const api = axios.create({
    adapter: demoAdapter,
    headers: {
        "Content-Type": "application/json",
    },
});
