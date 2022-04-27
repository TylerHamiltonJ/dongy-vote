let selectedElectorate = "Cook";

function getPartyLogo(party) {
  switch (party) {
    case "The Greens":
      return `url('./assets/greens.png')`;
    case "Liberal":
      return `url('./assets/lib.png')`;
    case "Australian Labor Party":
      return `url('./assets/alp.png')`;
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
</div>`;
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
    sourceDiv.appendChild(node);
  });

  document.querySelector("#num-of-candidates").textContent =
    selectedElectorate.candidates.length;
  html2canvas(sourceDiv).then((canvas) => {
    const h = screen.height;
    const w = screen.width;
    const sketchpad = document.getElementById("sketchpad");
    const context = sketchpad.getContext("2d");
    const size = calculateAspectRatioFit(canvas.width, canvas.height, w, h);
    if (w <= 900) {
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
  resizeCanvas();
  const electoratesEl = document.getElementById("electorates");
  const html = electorates
    .map((m) => m.electorate)
    .sort()
    .map((m) => `<option value="${m}">`)
    .join("");
  electoratesEl.innerHTML = html;
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
