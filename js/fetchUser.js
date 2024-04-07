function FetchUser() {

    return fetch("/userInfo", {
            method: "post",
            headers: { Authorization: "Bearer " + localStorage.getItem("userToken") },
        })
        .then((e) => e.json())
}