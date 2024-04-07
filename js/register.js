async function registerUser(username , password){

     // console.log(price)
     if (!(username && password)) return Promise.reject({
        msg: 'Please fill all fields',
        error: true
    })
    let use = '/signup'
    return fetch(use, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then(res => {
        return res.json()
    })

}