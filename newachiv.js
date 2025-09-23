// Firebase configuration
const firebaseConfig = {
  
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const calendar = document.getElementById('calendar');
const monthYearDiv = document.getElementById('monthYear');

// Color intensity for activity
function getColorForCount(count) {
  if (count === 0) return '#2c2c2c'; 
  if (count === 1) return '#fff176'; 
  if (count === 2) return '#ffeb3b';
  return '#fbc02d'; 
}

// Generate calendar
function generateCalendar(labsPerDay) {
  calendar.innerHTML = "";
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  monthYearDiv.textContent = `${monthNames[month]} ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('day');
    calendar.appendChild(emptyCell);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const count = labsPerDay[dateStr] || 0;
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');
    dayCell.textContent = day;
    dayCell.style.backgroundColor = getColorForCount(count);
    dayCell.setAttribute('data-tooltip', count === 0 ? 'No login' : `${count} activity`);

    const todayStr = today.toISOString().split('T')[0];
    if (dateStr === todayStr) dayCell.classList.add('today');
    calendar.appendChild(dayCell);
  }
}

// Parse activity data
function parseDataToLabsPerDay(achievements=[], logins=[]) {
  const labsPerDay = {};
  achievements.forEach(entry => {
    const dateStr = entry.completedAt.split('T')[0];
    labsPerDay[dateStr] = (labsPerDay[dateStr] || 0) + 1;
  });
  logins.forEach(dateStr => {
    if (!labsPerDay[dateStr]) labsPerDay[dateStr] = 1;
  });
  return labsPerDay;
}

// Streak update logic
async function updateStreak(uid) {
  const userRef = db.collection("users").doc(uid);
  const docSnap = await userRef.get();

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yestDate = yesterday.toISOString().split("T")[0];

  if (!docSnap.exists) {
    await userRef.set({
      streakCount: 1,
      lastLogin: today,
      logins: [today],
      createdAt: today
    });
    displayStreak(1);
    return;
  }

  const data = docSnap.data();
  const lastLogin = data.lastLogin;
  const streak = data.streakCount || 0;

  let newStreak;
  if (lastLogin === today) {
    newStreak = streak;
  } else if (lastLogin === yestDate) {
    newStreak = streak + 1;
  } else {
    newStreak = 1;
  }

  await userRef.update({
    streakCount: newStreak,
    lastLogin: today,
    logins: firebase.firestore.FieldValue.arrayUnion(today)
  });

  displayStreak(newStreak);
  fetchAndRenderCalendar(uid);
}

// Show streak
function displayStreak(count) {
  document.getElementById("streakDisplay").innerText = `🔥 Daily Streak: ${count} days`;
}

// Render calendar from Firestore
function fetchAndRenderCalendar(uid) {
  db.collection('users').doc(uid).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const achievements = data.achievements || [];
      const logins = data.logins || [];
      const labsPerDay = parseDataToLabsPerDay(achievements, logins);
      generateCalendar(labsPerDay);
    } else {
      generateCalendar({});
    }
  }).catch(console.error);
}

// Leaderboard
function loadLeaderboard() {
  db.collection("users")
    .orderBy("streakCount", "desc")
    .limit(10)
    .get()
    .then(snapshot => {
      const leaderboard = document.getElementById("leaderboard");
      leaderboard.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = `${data.username || "Anonymous"} — 🔥 ${data.streakCount} days`;
        leaderboard.appendChild(li);
      });
    })
    .catch(console.error);
}

// Auth listener
auth.onAuthStateChanged(user => {
  if (user) {
    updateStreak(user.uid);
    fetchAndRenderCalendar(user.uid);
    loadLeaderboard();
  } else {
    calendar.innerHTML = "<p>Please log in to see your daily streak.</p>";
  }
});

// Badge milestones
const badgeMilestones = [
  { days: 1,  name: "First Login",      icon: "🔥", desc: "Logged in for the first time!" },
  { days: 7,  name: "Beginner Scientist", icon: "🌟", desc: "7-day streak achieved!" },
  { days: 30, name: "Lab Master",       icon: "🏅", desc: "30-day streak achieved!" },
  { days: 100,name: "Science Pro",      icon: "🎓", desc: "100-day streak achieved!" }
];

// Display badges
function displayBadges(streakCount) {
  const badgeContainer = document.getElementById("badges");
  badgeContainer.innerHTML = "";

  badgeMilestones.forEach(badge => {
    const div = document.createElement("div");
    div.classList.add("badge");
    if (streakCount < badge.days) div.classList.add("locked");
    div.setAttribute("data-tooltip", badge.desc);

    div.innerHTML = `
      <div class="icon" style="font-size: 30px;">${badge.icon}</div>
      <span>${badge.name}</span>
    `;
    badgeContainer.appendChild(div);
  });
}

// Update streak and badges
function displayStreak(count) {
  document.getElementById("streakDisplay").innerText = `🔥 Daily Streak: ${count} days`;
  displayBadges(count);
}

