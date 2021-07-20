export default (name: string) => {
    if (document.body.className !== '') {
        document.body.setAttribute('class', '')
    }
    document.body.classList.add(name)
}

