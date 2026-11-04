const hour = document.getElementById('hour')
const minute = document.getElementById('minute')
const second = document.getElementById('second')
const studyList = document.getElementById('studyList')
const noteSelf = document.getElementById('noteSelf')
const subject_title = document.getElementById('subject_title')
const audio = document.getElementById('alarm_tone')
let studyBullets = []
let stopp = false

hour.addEventListener('input', () => {
     content = hour.textContent
     content = content.substring(1)
     if (content > 60) content = 60
     hour.textContent = content

     if (content == '') hour.textContent = '00'

     stop()
     moveCursorToEnd(hour)
})

minute.addEventListener('input', () => {
     content = minute.textContent
     content = content.substring(1)
     if (content > 60) content = 60
     minute.textContent = content

     if (content == '') minute.textContent = '00'

     stop()
     moveCursorToEnd(minute)
})

second.addEventListener('input', () => {
     content = second.textContent
     content = content.substring(1)
     if (content > 60) content = 59
     second.textContent = content

     if (content == '') second.textContent = '00'

     stop()
     moveCursorToEnd(second)
})

function convertToSeconds() {
     let hours = hour.textContent
     if (hours.charAt(0) == '0') hours = hours.substring(1)
     let minutes = minute.textContent
     if (minutes.charAt(0) == '0') minutes = minutes.substring(1)
     let seconds = second.textContent
     if (seconds.charAt(0) == '0') seconds = seconds.substring(1)

     seconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)

     return seconds
}

function convertToTime(seconds) {
     let hours = Math.trunc(seconds / 3600)
     let minutes = Math.trunc((seconds % 3600) / 60)
     seconds = (seconds % 3600) % 60

     hours = String(hours)
     minutes = String(minutes)
     seconds = String(seconds)

     if (hours.length == 1) hours = `0${hours}`
     if (minutes.length == 1) minutes = `0${minutes}`
     if (seconds.length == 1) seconds = `0${seconds}`

     hour.textContent = hours
     minute.textContent = minutes
     second.textContent = seconds
}

function start() {
     stopp = false

     const setTime = setInterval(() => {
          let timer = convertToSeconds()
          if (stopp || timer == 0) {
               clearInterval(setTime)
               audio.load()
               audio.volume = 1
               audio.play()
          } else {
               timer--
               convertToTime(timer)
          }
     }, 1000)
}

function restart() {
     hour.textContent = '00'
     minute.textContent = '00'
     second.textContent = '00'

     stopp = true
}

function stop() {
     stopp = true
     audio.pause()
}

function moveCursorToEnd(element) {
     // Focus the element first
     element.focus()

     // Create a new Range
     const range = document.createRange()

     // Select all contents inside the element
     range.selectNodeContents(element)

     // Collapse the range to the end (true = end of range)
     range.collapse(false)

     // Get the current selection and apply the range
     const selection = window.getSelection()
     selection.removeAllRanges()
     selection.addRange(range)
}

updateInfo()
async function updateInfo() {
     const response = await fetchInfo()
     const task_list = response.task_list.split('&^&')
     const { subject_name, note } = response

     noteSelf.innerText = note
     subject_title.innerText = subject_name

     task_list.forEach(task => {
          let taskBul = create(`<li>${task}</li>`)
          studyList.appendChild(taskBul)
     })
}

async function fetchInfo() {
     let name = window.location.href.split('/')[4]
     name.replaceAll('%20', ' ')
     console.log(name)

     try {
          const response = await fetch(`/subject/${name}/getDescription`)
          if (!response.ok) {
               throw new Error(`Response status: ${response.status}`)
          }
          const data = await response.json()
          return data[0]
     } catch (error) {
          console.log(error.message)
     }
}

function create(html) {
     const template = document.createElement('template')
     template.innerHTML = html.trim()
     return template.content.firstElementChild
}

studyList.addEventListener('input', autoSave)
noteSelf.addEventListener('input', autoSave)

async function autoSave() {
     let name = window.location.href.split('/')[4]

     let list = ''
     let listChild = studyList.children

     for (let i = 0; i < listChild.length; i++) {
          list += listChild[i].innerText
          if (i != listChild.length - 1) list += '&^&'
     }

     const note = noteSelf.innerText

     try {
          const response = await fetch(`/subject/${name}/update`, {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json' // Critical line
               },
               body: JSON.stringify({
                    note: note,
                    list: list
               })
          })
     } catch (error) {
          console.log(error.message)
     }
}
