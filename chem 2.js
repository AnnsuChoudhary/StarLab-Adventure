setTimeout(function() {
  if (window.innerWidth < 768) { // Mobile screen size
    alert("💡 This site is best viewed on a desktop for the best experience!");
  }
}, 1000);

function toggleMenu() {
  document.querySelector(".nav-menu").classList.toggle("show");
}


document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
  });
});
const canvas = document.getElementById("overlayCanvas");
const ctx = canvas.getContext("2d");

const elName = document.getElementById("elName");
const elSymbol = document.getElementById("elSymbol");
const elAtomic = document.getElementById("elAtomic");
const elType = document.getElementById("elType");

const clickSound = document.getElementById("clickSound");
const infoSound = document.getElementById("infoSound");

const elements = []; // Generate element layout below

const boxWidth = 60;
const boxHeight = 50;
const spacing = 5;

function generateElements() {
  const symbolToName = {
    H: "Hydrogen", He: "Helium", Li: "Lithium", Be: "Beryllium", B: "Boron", C: "Carbon", N: "Nitrogen", O: "Oxygen", F: "Fluorine", Ne: "Neon",
    Na: "Sodium", Mg: "Magnesium", Al: "Aluminium", Si: "Silicon", P: "Phosphorus", S: "Sulfur", Cl: "Chlorine", Ar: "Argon",
    K: "Potassium", Ca: "Calcium", Sc: "Scandium", Ti: "Titanium", V: "Vanadium", Cr: "Chromium", Mn: "Manganese", Fe: "Iron", Co: "Cobalt",
    Ni: "Nickel", Cu: "Copper", Zn: "Zinc", Ga: "Gallium", Ge: "Germanium", As: "Arsenic", Se: "Selenium", Br: "Bromine", Kr: "Krypton",
    Rb: "Rubidium", Sr: "Strontium", Y: "Yttrium", Zr: "Zirconium", Nb: "Niobium", Mo: "Molybdenum", Tc: "Technetium", Ru: "Ruthenium",
    Rh: "Rhodium", Pd: "Palladium", Ag: "Silver", Cd: "Cadmium", In: "Indium", Sn: "Tin", Sb: "Antimony", Te: "Tellurium", I: "Iodine", Xe: "Xenon",
    Cs: "Caesium", Ba: "Barium", La: "Lanthanum", Ce: "Cerium", Pr: "Praseodymium", Nd: "Neodymium", Pm: "Promethium", Sm: "Samarium", Eu: "Europium",
    Gd: "Gadolinium", Tb: "Terbium", Dy: "Dysprosium", Ho: "Holmium", Er: "Erbium", Tm: "Thulium", Yb: "Ytterbium", Lu: "Lutetium",
    Hf: "Hafnium", Ta: "Tantalum", W: "Tungsten", Re: "Rhenium", Os: "Osmium", Ir: "Iridium", Pt: "Platinum", Au: "Gold", Hg: "Mercury",
    Tl: "Thallium", Pb: "Lead", Bi: "Bismuth", Po: "Polonium", At: "Astatine", Rn: "Radon",
    Fr: "Francium", Ra: "Radium", Ac: "Actinium", Th: "Thorium", Pa: "Protactinium", U: "Uranium", Np: "Neptunium", Pu: "Plutonium",
    Am: "Americium", Cm: "Curium", Bk: "Berkelium", Cf: "Californium", Es: "Einsteinium", Fm: "Fermium", Md: "Mendelevium", No: "Nobelium", Lr: "Lawrencium",
    Rf: "Rutherfordium", Db: "Dubnium", Sg: "Seaborgium", Bh: "Bohrium", Hs: "Hassium", Mt: "Meitnerium", Ds: "Darmstadtium", Rg: "Roentgenium",
    Cn: "Copernicium", Nh: "Nihonium", Fl: "Flerovium", Mc: "Moscovium", Lv: "Livermorium", Ts: "Tennessine", Og: "Oganesson"
  };

  const rows = [
    ["H", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "He"],
    ["Li", "Be", "", "", "", "", "", "", "", "", "", "", "B", "C", "N", "O", "F", "Ne"],
    ["Na", "Mg", "", "", "", "", "", "", "", "", "", "", "Al", "Si", "P", "S", "Cl", "Ar"],
    ["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"],
    ["Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe"],
    ["Cs", "Ba", "La", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn"],
    ["Fr", "Ra", "Ac", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", ""],
    ["", "", "", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", ""]
  ];

  let atomicNumber = 1;
  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < rows[row].length; col++) {
      const symbol = rows[row][col];
      if (symbol !== "") {
        elements.push({
          symbol,
          name: symbolToName[symbol] || "Unknown",
          atomicNumber: atomicNumber++,
          type: getType(symbol),
          x: col * (boxWidth + spacing) + 20,
          y: row * (boxHeight + spacing) + 20
        });
      }
    }
  }
}


function getType(symbol) {
  const metals = ["Na", "K", "Ca", "Mg", "Al", "Fe", "Cu", "Zn", "Ag", "Au", "Hg", "Pb"];
  const nobleGases = ["He", "Ne", "Ar", "Kr", "Xe", "Rn", "Og"];
  const nonMetals = ["H", "C", "N", "O", "F", "P", "S", "Cl", "Se", "Br", "I", "At"];
  if (metals.includes(symbol)) return "Metal";
  if (nobleGases.includes(symbol)) return "Noble Gas";
  if (nonMetals.includes(symbol)) return "Non-metal";
  return "Other";
}

function drawTable() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let el of elements) {
    ctx.fillStyle = "#293352";
    ctx.fillRect(el.x, el.y, boxWidth, boxHeight);
    ctx.strokeStyle = "#00f2ff";
    ctx.strokeRect(el.x, el.y, boxWidth, boxHeight);
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText(el.symbol, el.x + 20, el.y + 30);
  }
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let el of elements) {
    if (x >= el.x && x <= el.x + boxWidth && y >= el.y && y <= el.y + boxHeight) {
      elName.textContent = el.name;
      elSymbol.textContent = el.symbol;
      elAtomic.textContent = el.atomicNumber;
      elType.textContent = el.type;
      clickSound.play();
      infoSound.play();
      break;
    }
  }
});

generateElements();
drawTable();


