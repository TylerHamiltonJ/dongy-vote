let selectedElectorate = "Cook";

function getPartyLogo(party) {
  switch (party) {
    case "The Greens":
    case "Queensland Greens":
    case "The Greens (WA)":
    case "The Greens NSW":
    case "Australian Greens":
      return `url('./assets/greens.png')`;
    case "Liberal":
      return `url('./assets/lib.png')`;
    case "United Australia Party":
      return `url('./assets/uap.png')`;
    case "Australian Labor Party":
      return `url('./assets/alp.png')`;
    case "Pauline Hanson's One Nation":
      return `url('./assets/onenation.png')`;
    case "Animal Justice Party":
      return `url('./assets/ajp.png')`;
    case "Liberal Democratic Party":
      return `url('./assets/ldp.png')`;
    case "Country Liberal Party (NT)":
      return `url('./assets/ldp.png')`;
    case "Liberal National Party of Queensland":
      return `url('./assets/lnp.png')`;
    case "The Nationals":
      return `url('./assets/nat.png')`;
    default:
      return "none";
  }
}

async function createBallot(electorate) {
  const templateHTML = `
<div class="header">
  <div style="background-image: url('./assets/auslogo.png')"></div>
  <div style="height: auto">House of Representatives Ballot Paper</div>
  <div style="background-image: url('./assets/sig.png')"></div>
</div>
<div class="state-name"></div>
<div class="electorate-name"></div>
<div class="instructions">
  Number the boxes from 1 to <span id="num-of-candidates">8</span> in
  the order of your choice
</div>
<div class="candidates"></div>
<div class="footer"></div>`;
  const ballotDiv = document.createElement("div");
  ballotDiv.id = "copy";
  ballotDiv.innerHTML = templateHTML.trim();
  document.body.appendChild(ballotDiv);
  const selectedElectorate = electorates.find(
    (f) => f.electorate === electorate
  );
  document.querySelector(".state-name").textContent = selectedElectorate.state;
  document.querySelector(
    ".electorate-name"
  ).textContent = `Electoral Division of ${selectedElectorate.electorate}`;

  const sourceDiv = document.querySelector("#copy");
  selectedElectorate.candidates.forEach((e, i) => {
    const node = document.createElement("div");
    node.className = "row";
    node.innerHTML = `<div
    class="party-logo"
    style="background-image: ${getPartyLogo(e.party)}"
  ></div>
  <div>
    <div class="box"></div>
  </div>
  <div>
    <div class="name">${e.name}</div>
    <div class="party">${e.party.toUpperCase()}</div>
  </div>`;
    document.querySelector(".candidates").appendChild(node);
  });

  document.querySelector("#num-of-candidates").textContent =
    selectedElectorate.candidates.length;
  html2canvas(sourceDiv, { logging: false }).then((canvas) => {
    const h = document.body.clientHeight;
    const w = document.body.clientWidth;
    const sketchpad = document.getElementById("sketchpad");
    const context = sketchpad.getContext("2d");
    var dataURL = canvas.toDataURL();
    console.log(dataURL);
    const size = calculateAspectRatioFit(canvas.width, canvas.height, w, h);
    if (w <= 800) {
      sketchpad.width = w;
      sketchpad.height = h;
    } else {
      // If on large screen
      // Make canvas the size of the ballot
      sketchpad.width = size.width;
      sketchpad.height = size.height;
    }
    context.clearRect(0, 0, sketchpad.width, sketchpad.height);
    context.drawImage(
      canvas,
      (sketchpad.width - size.width) / 2,
      0,
      size.width,
      size.height
    );
    sourceDiv.remove();
  });
}

window.onload = function () {
  checkResize();
  const electoratesEl = document.getElementById("electorates-input");
  const sortedElectorates = electorates.map((m) => m.electorate).sort();
  sortedElectorates.forEach((e) => {
    const option = document.createElement("option");
    option.value = e;
    option.textContent = e;
    console.log(option);
    electoratesEl.appendChild(option);
  });

  //   .map((m) => `<option value="${m}">${m}</option>`)
  //   .join("");
  // electoratesEl.innerHTML = html;
  document
    .getElementById("electorates-input")
    .addEventListener("input", (e) => {
      if (
        !(e instanceof InputEvent) ||
        e.inputType === "insertReplacementText"
      ) {
        selectedElectorate = e.target.value;
        createBallot(e.target.value);
      }
    });
};
