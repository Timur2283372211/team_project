console.clear()
//localStorage.clear()
//змінні
let tasks = []
let times = []
let dates = []
let completeTasks = []

let deadLineTimeDetails = {} // заготовка для утворення кінцевої дати
let currentTimeDetails = new Date() // поточна дата
let diff = 0 // різниця між датами

let iconNumberClicked = 0

let addTaskButton = document.querySelector("button")
let input = document.querySelector(".task")
let inputTime = document.querySelector(".time")
let inputDate = document.querySelector(".date")
let taskList = document.querySelector(".task-list")

//відновлення списку
let prevTasks = localStorage.getItem("mytasks")
let prevTimes = localStorage.getItem("mytimes")
let prevDates = localStorage.getItem("mydates")
let prevCompleteTasks = localStorage.getItem("mycompletetasks")

if (prevTasks) {
	tasks = prevTasks.split(",")
	times = prevTimes.split(",")
	dates = prevDates.split(",")
	completeTasks = prevCompleteTasks.split(",").map(Number) //[0, 1]
	tasks.forEach((item, index) => {
		let taskRow = document.createElement("div")
		taskRow.setAttribute("class", "task-row")
		let elementTask = document.createElement("div")
		let deadline = document.createElement("div")
		//налаштовую вигляд іконки
		let editIcon = document.createElement("i")
		let doneIcon = document.createElement("i")
		let closeIcon = document.createElement("i")
		editIcon.classList = "far fa-edit"
		doneIcon.classList = "fa-solid fa-check"
		closeIcon.classList = "fas fa-window-close"

		taskRow.setAttribute("data-number", index)
		editIcon.addEventListener("click", showModal)
		doneIcon.addEventListener("click", doneTask)
		closeIcon.addEventListener("click", deleteTask)

		taskList.appendChild(taskRow)
		if (!(completeTasks[index])) {
			// утворюємо кінцеву дату
			let data_y_m_d = dates[index].split("-").map(Number)
			let data_h_m = times[index].split(":").map(Number)
			// виправляємо місяць, слід зменшити після зчитування на 1
			data_y_m_d[1] = data_y_m_d[1] - 1
			// утворюємо кінцеву дату
			deadLineTimeDetails = new Date(...[...data_y_m_d, ...data_h_m])
			// дізнаємося різницю в мілісекундах
			diff = deadLineTimeDetails - currentTimeDetails
			if (diff < 0) {
				deadline.textContent = "Часу не залишилось"
			}
			else {
				// записуємо текст у вузли
				deadline.textContent = `Залишось ${distanceDates(diff)[2]} дн. ${distanceDates(diff)[1]} год. ${distanceDates(diff)[0]} хв.`
			}
		}
		else {
			deadline.textContent = "ВИКОНАНО"
			editIcon.style.pointerEvents = "none"
			doneIcon.classList = "fa-solid fa-reply"
			elementTask.style.textDecoration = "line-through"
		}

		elementTask.textContent = tasks[index]

		// виводимо вузлів на екран
		taskRow.appendChild(elementTask)
		taskRow.appendChild(deadline)
		taskRow.appendChild(editIcon)
		taskRow.appendChild(doneIcon)
		taskRow.appendChild(closeIcon)

	})
}


function distanceDates(d, minutesLeft, hoursLeft, daysLeft) {
	// вираховуємо
	minutesLeft = Math.trunc(d / (1000 * 60)) % 60
	hoursLeft = Math.trunc(d / (1000 * 60 * 60)) % 24
	daysLeft = Math.trunc(d / (1000 * 60 * 60 * 24))
	return [minutesLeft, hoursLeft, daysLeft]
}

//натиснення на +
addTaskButton.addEventListener("click", () => {
	if (input.value && inputTime.value && inputDate.value) {
		let taskRow = document.createElement("div")

		taskRow.setAttribute("class", "task-row")
		taskRow.setAttribute("data-number", tasks.length)
		let elementTask = document.createElement("div")
		let deadline = document.createElement("div")
		//налаштовую вигляд іконки
		let editIcon = document.createElement("i")
		let doneIcon = document.createElement("i")
		let closeIcon = document.createElement("i")

		editIcon.classList = "far fa-edit"
		doneIcon.classList = "fa-solid fa-check"
		closeIcon.classList = "fas fa-window-close"

		editIcon.addEventListener("click", showModal)
		doneIcon.addEventListener("click", doneTask)
		closeIcon.addEventListener("click", deleteTask)
		// записуємо текст у вузли
		elementTask.textContent = input.value
		// утворюємо кінцеву дату
		let data_y_m_d = inputDate.value.split("-").map(Number)
		let data_h_m = inputTime.value.split(":").map(Number)
		// виправляємо місяць, слід зменшити після зчитування на 1
		data_y_m_d[1] = data_y_m_d[1] - 1
		// утворюємо кінцеву дату
		deadLineTimeDetails = new Date(...[...data_y_m_d, ...data_h_m])
		// дізнаємося різницю в мілісекундах
		diff = deadLineTimeDetails - currentTimeDetails
		if (diff < 0) {
			deadline.textContent = "Часу не залишилось"
		}
		else {
			deadline.textContent = `Залишось ${distanceDates(diff)[2]} дн. ${distanceDates(diff)[1]} год. ${distanceDates(diff)[0]} хв.`

			taskList.appendChild(taskRow)

			// виводимо вузлів на екран
			taskRow.appendChild(elementTask)
			taskRow.appendChild(deadline)
			taskRow.appendChild(editIcon)
			taskRow.appendChild(doneIcon)
			taskRow.appendChild(closeIcon)

			// записуємо в базу local storage
			tasks.push(input.value)
			times.push(inputTime.value)
			dates.push(inputDate.value)
			completeTasks.push(0)

			localStorage.setItem("mytasks", tasks)
			localStorage.setItem("mytimes", times)
			localStorage.setItem("mydates", dates)
			localStorage.setItem("mycompletetasks", completeTasks)
		}
	}
})
let modal = document.querySelector(".modal")

// let modalTask =
function showModal(n, taskModal, timeModal, dateModal) {
	modal.style.display = "flex"
	n = this.parentNode.dataset.number
	taskModal = document.querySelector(".task-modal")
	timeModal = document.querySelector(".time-modal")
	dateModal = document.querySelector(".date-modal")
	taskModal.value = tasks[n]
	timeModal.value = times[n]
	dateModal.value = dates[n]
	iconNumberClicked = n
	console.log(iconNumberClicked)
}

let changeBtn = document.querySelector(".change-btn")

changeBtn.addEventListener("click", changeTask)

function changeTask(taskModal, timeModal, dateModal) {
	taskModal = document.querySelector(".task-modal")
	timeModal = document.querySelector(".time-modal")
	dateModal = document.querySelector(".date-modal")
	taskRows = document.querySelectorAll(".task-row")
	taskRows[iconNumberClicked].childNodes[0].textContent = taskModal.value
	// утворюємо кінцеву дату
	let data_y_m_d = dateModal.value.split("-").map(Number)
	let data_h_m = timeModal.value.split(":").map(Number)
	// виправляємо місяць, слід зменшити після зчитування на 1
	data_y_m_d[1] = data_y_m_d[1] - 1
	// утворюємо кінцеву дату
	deadLineTimeDetails = new Date(...[...data_y_m_d, ...data_h_m])
	// дізнаємося різницю в мілісекундах
	diff = deadLineTimeDetails - currentTimeDetails
	if (diff < 0) {
		taskRows[iconNumberClicked].childNodes[1].textContent = "Часу не залишилось"
	}
	else {
		taskRows[iconNumberClicked].childNodes[1].textContent = `Залишось ${distanceDates(diff)[2]} дн. ${distanceDates(diff)[1]} год. ${distanceDates(diff)[0]} хв.`
	}

	// записуємо в базу local storage
	tasks[iconNumberClicked] = taskModal.value
	times[iconNumberClicked] = timeModal.value
	dates[iconNumberClicked] = dateModal.value
	completeTasks[iconNumberClicked] = 0

	localStorage.setItem("mytasks", tasks)
	localStorage.setItem("mytimes", times)
	localStorage.setItem("mydates", dates)
	localStorage.setItem("mycompletetasks", completeTasks)

	modal.style.display = "none"
}
function doneTask() { // натиснення на галочку
	n = this.parentNode.dataset.number
	let rows = document.querySelectorAll(".task-row")
	rows[n].childNodes[0].style.textDecoration = "line-through"
	rows[n].childNodes[1].textContent = "ВИКОНАНО"
	rows[n].childNodes[2].style.pointerEvents = "none"
	rows[n].childNodes[3].classList = "fa-solid fa-reply"
	rows[n].childNodes[3].addEventListener("click", backTask)
	completeTasks[n] = 1
	console.log(completeTasks[n])
	localStorage.setItem("mycompletetasks", completeTasks)
}
function backTask() { // натиснення на стрілочку
	let rows = document.querySelectorAll(".task-row")
	n = this.parentNode.dataset.number

	let deadline = rows[n].childNodes[1]

				// утворюємо кінцеву дату
				let data_y_m_d = dates[n].split("-").map(Number)
				let data_h_m = times[n].split(":").map(Number)
				// виправляємо місяць, слід зменшити після зчитування на 1
				data_y_m_d[1] = data_y_m_d[1] - 1
				// утворюємо кінцеву дату
				deadLineTimeDetails = new Date(...[...data_y_m_d, ...data_h_m])
				// дізнаємося різницю в мілісекундах
				diff = deadLineTimeDetails - currentTimeDetails
				if (diff < 0) {
					deadline.textContent = "Часу не залишилось"
				}
				else {
					// записуємо текст у вузли
					deadline.textContent = `Залишось ${distanceDates(diff)[2]} дн. ${distanceDates(diff)[1]} год. ${distanceDates(diff)[0]} хв.`
				}

	rows[n].childNodes[0].style.textDecoration = "none"
	rows[n].childNodes[2].style.pointerEvents = "auto"
	rows[n].childNodes[3].classList = "fa-solid fa-check"
	rows[n].childNodes[3].removeEventListener("click", backTask)
	completeTasks[n] = 0
	console.log(completeTasks[n])
	localStorage.setItem("mycompletetasks", completeTasks)
}
function deleteTask() {
	n = this.parentNode.dataset.number
	let rows = document.querySelectorAll(".task-row")
	rows[n].style.display = "none"

	// записуємо в базу local storage
	tasks.splice(n, 1)
	times.splice(n, 1)
	dates.splice(n, 1)
	completeTasks.splice(n, 1)

	localStorage.setItem("mytasks", tasks)
	localStorage.setItem("mytimes", times)
	localStorage.setItem("mydates", dates)
	localStorage.setItem("mycompletetasks", completeTasks)
}






