const background = document.getElementById("background");
const new_cell = document.getElementById("new_cell");
const dashboard_main = document.getElementById("dashboard_main");

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
            <div class="cell_header"></div>
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
}

async function fetchInfo() {
  try {
    const response = await fetch("/getSubjects");
    if (!response.ok) {
      throw new Error(`Response status: ${respose.status}`);
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
