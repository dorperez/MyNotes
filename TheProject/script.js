// localStorage.clear()
let notesData;

const addNoteButtonListener = () => {
    document.querySelector(`#addNoteButton`).addEventListener(`click`, (event) => {

        event.preventDefault()
        const noteForm = document.querySelector(`#newNoteForm`)
        const noteTitle = document.querySelector(`#noteTitle`).value
        const noteDescription = document.querySelector(`#noteDescription`).value
        const noteDate = document.querySelector(`#noteDate`).value
        const noteTime = document.querySelector(`#noteTime`).value

        console.log(noteTitle, noteDescription, noteDate, noteTime)

        if (!noteTitle || !noteDescription || !noteDate || !noteTime) return alert("Please fill all the fields")



        const newNote = {
            index: notesData.length,
            noteTitle,
            noteDescription,
            noteDate,
            noteTime
        }

        noteForm.reset()
        notesData.push(newNote)
        saveNotesToLocalStorage()
        addNewNote(newNote, true)
    })
}



const displayNotes = () => {
    let allNotesDiv = document.querySelector(`.notesDiv`)
    allNotesDiv.innerHTML = ``
    for (let i = notesData.length - 1; i >= 0; i--) {
        addNewNote(notesData[i])
    }
}


const addNewNote = (newNote, insertAtTop = false) => {
    let allNotesDiv = document.querySelector(`.notesDiv`)
    let containerDiv = document.createElement(`div`)
    let contentDiv = document.createElement(`div`)
    let noteTitleDiv = document.createElement(`div`)
    let noteTitle = document.createElement(`h2`)
    let deleteButton = document.createElement(`button`)

    //Container
    containerDiv.style.fontFamily = "quicksand"
    containerDiv.style.height = "300px"
    containerDiv.style.backgroundImage = "url('https://i.ibb.co/GCnkYpf/note-Background-1.webp')"
    containerDiv.style.backgroundSize = "contain"
    containerDiv.style.backgroundRepeat = "no-repeat"
    containerDiv.style.backgroundPosition = "center"
    containerDiv.style.borderRadius = "25px"
    containerDiv.style.marginLeft = "8px"
    containerDiv.style.marginRight = "8px"
    containerDiv.classList.add("noteContainer")
    containerDiv.classList.add("fade-in")

    //Delete Button
    deleteButton.classList.add("deleteButton")
    deleteButton.innerHTML = `<img height="30px" width="30px" src="https://i.ibb.co/GvhnMmQ/delete-icon.png"></img>`
    deleteButton.style.background = "none"
    deleteButton.style.border = "none"
    deleteButton.style.position = "relative"
    deleteButton.style.left = "9px"
    deleteButton.style.marginTop = "60px"
    deleteButton.style.opacity = "0"

    //Delete Button Listener
    deleteButton.addEventListener(`click`, () => {
        const noteContainer = deleteButton.closest('.noteContainer')
        noteContainer.classList.add('fade-out')
        noteContainer.classList.add('show')

        setTimeout(() => {
            notesData.splice(newNote.index, 1)
            noteContainer.remove()
            saveNotesToLocalStorage()
            updateIndices()

            if (notesData.length === 0) {
                showEmptyNotesTitles()
            }
        }, 500)
    })

    // Title Div
    noteTitleDiv.style.marginRight = "12px"
    noteTitleDiv.style.marginLeft = "12px"
    noteTitleDiv.style.overflow = "hidden"
    noteTitleDiv.style.whiteSpace = "nowrap"
    noteTitleDiv.style.boxSizing = "border-box"
    noteTitleDiv.style.textAlign = "center"
    noteTitleDiv.classList.add(`noteTitleDiv`)

    // Title
    noteTitle.textContent = newNote.noteTitle
    noteTitle.classList.add(`noteTitle`)
    noteTitle.style.display = "inline-block"

    if (newNote.noteTitle.length >= 12) {
        noteTitle.style.paddingLeft = "100%"
        noteTitle.style.animation = "move 10s linear infinite"
    } else {
        noteTitle.style.paddingLeft = "0"
        noteTitle.style.animation = "none"
        noteTitle.style.whiteSpace = "nowrap";
        noteTitle.style.overflow = "hidden";
    }

    noteTitleDiv.appendChild(noteTitle)

    //Note Content
    contentDiv.style.height = "90px"
    contentDiv.style.width = "250px"
    contentDiv.style.wordBreak = "break-all"
    contentDiv.style.marginLeft = "auto"
    contentDiv.style.marginRight = "auto"
    contentDiv.style.overflowY = "scroll"
    contentDiv.style.scrollbarWidth = 'none'
    contentDiv.style.textAlign = "center"
    contentDiv.style.fontSize = "18px"
    contentDiv.classList.add(`contentDiv`)

    contentDiv.innerHTML = `
    <p id="noteContent">${newNote.noteDescription}`

    //Date and Time
    const noteDataAndTimeDiv = document.createElement(`div`)
    const dateText = document.createElement(`h5`)
    const timeText = document.createElement(`h5`)
    timeText.classList.add(`noteTimeElement`)
    dateText.classList.add(`noteDateElement`)
    noteDataAndTimeDiv.style.position = "relative"
    noteDataAndTimeDiv.style.display = `flex`
    noteDataAndTimeDiv.style.top = "19px"
    noteDataAndTimeDiv.style.left = "10px"
    noteDataAndTimeDiv.style.fontSize = "16px"
    noteDataAndTimeDiv.classList.add("noteDataAndTimeDiv")

    //Date Edit Dialog
    dateText.textContent = `${newNote.noteDate}`
    dateText.style.marginRight = `8px`
    dateText.style.fontSize = `16px`

    dateText.addEventListener(`click`, () => {
        const datePickerDialog = document.querySelector('#datePickerDialog');
        const dateInput = document.querySelector('#dateInput');
        const saveDateButton = document.querySelector('#saveDateButton');

        const closeDialogButton = document.querySelector('#closeDateDialogButton');
        datePickerDialog.style.display = 'block';

        closeDialogButton.addEventListener(`click`, () => {
            datePickerDialog.style.display = 'none'
        })

        saveDateButton.addEventListener(`click`, () => {
            datePickerDialog.style.display = 'none'
            notesData[newNote.index].noteDate = dateInput.value
            document.querySelector(`.noteDateElement`).textContent = dateInput.value
            saveNotesToLocalStorage()
        })

    })

    //Time Edit Dialog
    timeText.style.fontSize = `16px`
    timeText.textContent = `${newNote.noteTime}`

    noteDataAndTimeDiv.appendChild(dateText)
    noteDataAndTimeDiv.appendChild(timeText)

    timeText.addEventListener(`click`, () => {
        const timePickerDialog = document.querySelector('#timePickerDialog');
        const timeInput = document.querySelector('#timeInput');
        const saveTimeButton = document.querySelector('#saveTimeButton');
        const closeDialogButton = document.querySelector('#closeDialogButton');
        timePickerDialog.style.display = 'block';

        closeDialogButton.addEventListener(`click`, () => {
            timePickerDialog.style.display = 'none'
        })

        saveTimeButton.addEventListener(`click`, () => {
            timePickerDialog.style.display = 'none'
            notesData[newNote.index].noteTime = timeInput.value
            document.querySelector(`.noteTimeElement`).textContent = timeInput.value
            saveNotesToLocalStorage()
        })


    })

    hideEmptyNotesTitles()

    //Edit Title And P
    addEditableListener(noteTitle, newNote)
    addEditableListener(contentDiv, newNote)

    // Append
    containerDiv.appendChild(deleteButton)
    containerDiv.appendChild(noteTitleDiv)
    containerDiv.appendChild(contentDiv)
    containerDiv.appendChild(noteDataAndTimeDiv)
    // allNotesDiv.appendChild(containerDiv)

    if (insertAtTop) {
        allNotesDiv.prepend(containerDiv)
    } else {
        allNotesDiv.appendChild(containerDiv)
    }

    const delay = (notesData.length + 1 - newNote.index - 1) * 200

    setTimeout(() => {
        containerDiv.classList.add('show')
    }, delay)
}

const addEditableListener = (element, currentNote) => {
    element.addEventListener('click', (el) => {
        element.contentEditable = true
        element.focus()

        element.addEventListener('blur', (el) => {
            const tagType = element.tagName
            let trimmedText = el.target.innerText.trim()

            if (tagType === "H2") {
                notesData[currentNote.index].noteTitle = trimmedText
                el.target.innerHTML = trimmedText
                el.target.style.display = "inline-block"
                if (el.target.innerText.length >= 12) {
                    element.style.paddingLeft = "100%"
                    element.style.animation = "move 10s linear infinite"
                } else {
                    element.style.paddingLeft = "0"
                    element.style.animation = "none"
                    element.style.whiteSpace = "nowrap"
                    element.style.overflow = "hidden"
                }
            } else if (tagType === "DIV") {
                notesData[currentNote.index].noteDescription = trimmedText
                document.querySelector(`#noteContent`).innerHTML = trimmedText
                element.innerHTML = `${trimmedText}`
            }

            element.contentEditable = false
            saveNotesToLocalStorage()
        })
    });
}


const getNotesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(`notesData`))
}

const saveNotesToLocalStorage = () => {
    localStorage.setItem(`notesData`, JSON.stringify(notesData))
}

const updateIndices = () => {
    notesData.forEach((note, index) => {
        note.index = index
    })
    saveNotesToLocalStorage()
}

const hideEmptyNotesTitles = () => {
    const titlesDiv = document.querySelector(`.emptyTitles`)
    if (titlesDiv) {
        titlesDiv.remove()
    }
}

const showEmptyNotesTitles = () => {
    const body = document.querySelector(`body`)
    const titlesDiv = document.createElement(`div`)
    const emptyNotesTitle = document.createElement(`h1`)
    const addSomeBuddyTitle = document.createElement(`h5`)

    titlesDiv.classList.add("emptyTitles")
    titlesDiv.style.marginTop = `50px`

    emptyNotesTitle.textContent = "No Notes Found ..."
    emptyNotesTitle.style.textAlign = `center`

    addSomeBuddyTitle.textContent = "Please Add Some Buddy!"
    addSomeBuddyTitle.style.textAlign = `center`

    titlesDiv.appendChild(emptyNotesTitle)
    titlesDiv.appendChild(addSomeBuddyTitle)
    body.appendChild(titlesDiv)
}

const initNoteData = () => {
    notesData = getNotesFromLocalStorage()
    if (!notesData || notesData.length === 0) {
        notesData = []
        showEmptyNotesTitles()
    } else {
        displayNotes()
    }
}

const main = () => {
    initNoteData()
    addNoteButtonListener()
}

//Starting The Notes Party
main()



