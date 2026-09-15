const background = document.getElementById("background");
const new_cell = document.getElementById("new_cell");
const dashboard_main = document.getElementById("dashboard_main");
let checkbox;

function select() {
  checkbox.forEach((box) => {
    if (box.style.display == "none") {
      box.style.display = "block";
    } else {
      box.style.display = "none";
      box.checked = false;
    }
  });
}

async function deleteCard() {
  counter = 0;
  let subjectList = [];
  checkbox.forEach((box) => {
    if (box.style.display != "none") {
      counter++;
      box.style.display = "none";
      if (box.checked) {
        let selectedBox = box.parentElement.parentElement
          .querySelector(".cell_body")
          .querySelector("h3").textContent;

        selectedBox = selectedBox.replaceAll(",", "%2C");
        subjectList.push(selectedBox);
        box.checked = false;
      }
    }
  });
  if (counter == 0) window.alert("Select Cards First");
  else {
    try {
      const response = await fetch("/deleteSubject", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          subjects: subjectList,
        }),
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}

function createCard() {
  background.style.display = "block";
  new_cell.style.display = "block";
}

function hide() {
  background.style.display = "none";
  new_cell.style.display = "none";
}

loadContent();

async function loadContent() {
  const subjects = await fetchInfo();
  console.log(subjects);

  subjects.forEach((subject) => {
    const title = subject.subject_name;
    const desc = subject.description;

    const card = create(`
          <div class="cells">
            <div class="cell_header">
              <input type="checkbox" id="check">
            </div>
            <div class="cell_body">
              <h3>${title}</h3>
              <p>
              ${desc}
              </p>
            </div>
          </div>
    `);

    dashboard_main.appendChild(card);
  });
  checkbox = document.querySelectorAll("#check");
}

async function fetchInfo() {
  try {
    const response = await fetch("/getSubjects");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    return data.subjects;
  } catch (error) {
    console.log(error.message);
  }
}

function create(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}
