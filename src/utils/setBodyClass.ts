
export default (name: string) => {
    if (document.body.className !== '') {
        document.body.classList.remove(document.body.className)
    }
    document.body.classList.add(name)
}

