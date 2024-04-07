async function logUser(username , password){

    // console.log(price)
    if (!(username && password)) return Promise.reject({
       msg: 'Please fill all fields',
       error: true
   })
   let use = '/login'
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