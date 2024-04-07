function Personal(formId) {
    const form = document.getElementById(formId)
    const formData = new FormData(form);
    formData.append('userId', localStorage.getItem('UserID'))

    let use = '/personal'
    return fetch(use, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData))
    }).then(res => {
        return res.json()
    })

}