(async () => {
    const id = window.location.href.split('/').pop()
    const response = await fetch(`/getStudent/${id}`);
    const user = await response.json();
    console.log(user)

    document.getElementById('name').textContent = user.name
    document.getElementById('class').textContent = user.classNumber
})()
