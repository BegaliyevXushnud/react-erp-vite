
import https from "./config";
const auth = {
    sign_up: (data) => https.post("/auth/user/sign-up", data),
    sign_in: (data) => https.post("/auth/sign-in", data),
}
export default auth