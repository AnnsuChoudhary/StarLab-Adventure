// Enable Panzoom for solar system
const panzoomInstance = Panzoom(document.getElementById('solarSystem'), {
  maxScale: 2.5,
  minScale: 0.5
});

document.getElementById('solarWrapper').addEventListener('wheel', panzoomInstance.zoomWithWheel);

// Planet data with images and facts
const planetData = {
  Sun: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sun_white.jpg',
    details: {
      "Type": "Star",
      "Mass": "1.989 × 10³⁰ kg",
      "Surface Temp": "5,778 K",
      "Fun Fact": "The Sun contains 99.86% of all mass in the solar system!"
    }
  },
  Mercury: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
    details: {
      "Moons": "0",
      "Revolution": "88 days",
      "Rotation": "58.6 days",
      "Diameter": "4,879 km",
      "Fun Fact": "Mercury has no atmosphere to retain heat!"
    }
  },
  Venus: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg',
    details: {
      "Moons": "0",
      "Revolution": "225 days",
      "Rotation": "243 days (retrograde)",
      "Diameter": "12,104 km",
      "Fun Fact": "Venus spins backwards compared to most planets!"
    }
  },
  Earth: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
    details: {
      "Moons": "1",
      "Revolution": "365.25 days",
      "Rotation": "24 hours",
      "Diameter": "12,742 km",
      "Fun Fact": "Earth is the only known planet with life."
    }
  },
  Mars: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
    details: {
      "Moons": "2",
      "Revolution": "687 days",
      "Rotation": "24.6 hours",
      "Diameter": "6,779 km",
      "Fun Fact": "Mars has the tallest volcano in the solar system — Olympus Mons."
    }
  },
  Jupiter: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg',
    details: {
      "Moons": "95",
      "Revolution": "11.9 years",
      "Rotation": "9.9 hours",
      "Diameter": "139,820 km",
      "Fun Fact": "Jupiter’s Great Red Spot is a storm that's raged for centuries!"
    }
  },
  Saturn: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
    details: {
      "Moons": "146",
      "Revolution": "29.5 years",
      "Rotation": "10.7 hours",
      "Diameter": "116,460 km",
      "Fun Fact": "Saturn’s rings are mostly ice particles and are surprisingly thin!"
    }
  },
  Uranus: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
    details: {
      "Moons": "27",
      "Revolution": "84 years",
      "Rotation": "17.2 hours",
      "Diameter": "50,724 km",
      "Fun Fact": "Uranus spins on its side — unlike any other planet!"
    }
  },
  Neptune: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg',
    details: {
      "Moons": "14",
      "Revolution": "165 years",
      "Rotation": "16.1 hours",
      "Diameter": "49,244 km",
      "Fun Fact": "Neptune has the fastest winds in the solar system!"
    }
  }
};

// Show modal popup with planet info
function showPlanetInfo(name) {
  const modal = document.getElementById('planetModal');
  const image = document.getElementById('planetImage');
  const nameElem = document.getElementById('modalPlanetName');
  const list = document.getElementById('modalPlanetDetails');

  const planet = planetData[name];
  if (!planet) return;

  image.style.backgroundImage = `url(${planet.image})`;
  nameElem.textContent = name;
  list.innerHTML = "";

  for (let key in planet.details) {
    const li = document.createElement("li");
    li.textContent = `${key}: ${planet.details[key]}`;
    list.appendChild(li);
  }

  modal.style.display = 'flex';
}

// Hide modal
function closeModal() {
  document.getElementById('planetModal').style.display = 'none';
}
