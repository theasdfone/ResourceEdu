const register = {
    registerNewUser(registrationData) {
        return new Promise((resolve, reject) => {
            const requestBody = {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(registrationData)
            }
    
            fetch("/signup", requestBody)
            .then((res) => {
                if(res.ok) window.location.replace("/login");
                else if(res.status === 400) resolve("Username Taken");
            }).catch((error) => {
                reject(error);
            })
        });
    }
}

export default register;