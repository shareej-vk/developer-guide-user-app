
export const ssr = false;
import init, { decrypt_json } from "$lib/pkg/wasm_encryptor.js";

function validateUser() {
    let studentToken = localStorage.getItem("studentToken");
    if (!studentToken) {
        return false;
    } else {
        // Decrypt the token
        try {
            let token = decrypt_json(studentToken);
            const now = new Date(token.nowDate);
            const expiry = new Date(token.expiryDate);
            const isExpired = now > expiry;
            if (isExpired) {
                return false;
            } else {

                return true;
            }
        } catch (error) {
            return false;
        }
    }
}



export async function load({ fetch, params }) {
    let userData = null;
    await init();
    let isAuthorized = validateUser();
    if (isAuthorized) {
        let userDataFromLocalStorage = localStorage.getItem("userData");
        if (userDataFromLocalStorage) {
            userData = JSON.parse(userDataFromLocalStorage);
        }
        return {
            isAuthorized,
            userData
        };
    }

}
