import { environment } from "../../environments/environment";

const user = {
    loginUser(loginData) {
        return new Promise((resolve, reject) => {
            const requestBody = {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(loginData)
            };

            fetch(environment.apiUrl + "/signin", requestBody)
            .then((res) => {
                if(res.ok) resolve(res.json());
                else if(res.status === 401) reject("Authentication Denied");
                else reject("Error");
            }).catch((error) => {
                reject(error);
            });
        });
    },

    registerUser(registrationData) {
        return new Promise((resolve, reject) => {
            const requestBody = {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(registrationData)
            }
    
            fetch(environment.apiUrl + "/signup", requestBody)
            .then((res) => {
                if(res.ok) window.location.replace("/login");
                else if(res.status === 400) resolve("Username Taken");
            }).catch((error) => {
                reject(error);
            })
        });
    },

    changePassword(password) {
        return new Promise((resolve, reject) => {
            const requestBody = {
                method: "POST",
                headers: this.authHeader(),
                body: password
            }
    
            fetch(environment.apiUrl + "/changepassword/" + this.getCurrentUser().id, requestBody)
            .then((res) => {
                if(res.ok) window.location.replace("/login");
                else if(res.status === 400) resolve("Network Error");
            }).catch((error) => {
                reject(error);
            })
        });
    },

    delete() {
        return new Promise((resolve, reject) => {
            const requestBody = {
                method: "POST",
                headers: this.authHeader(),
            };

            fetch(environment.apiUrl + "/deleteuser/" + this.getCurrentUser().id, requestBody)
            .then((res) => {
                if(res.ok) resolve(res);
                else resolve("Network Error")
            }).catch((error) => {
                reject(error);
            });
        }).then(() => {
            this.logout();
            window.location.replace("/");
        });
    },

    logout() {
        localStorage.removeItem("user");
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    },

    authHeader(headers) {
        const user = this.getCurrentUser();
        return user ? {Authorization: "Bearer " + user.token, ...headers} : {};
    }
};

export default user;
