// Motivational quotes
const quotes = [
    "Senpai, you're doing great! Keep it up! 💖",
    "Ganbatte! I believe in you! ✨",
    "One iteration at a time! We got this! 🌸",
    "Don't give up! Look how far you've come! 🌟",
    "Make today amazing, Master! 🎀",
    "Remember to take breaks and drink water! ☕",
    "You are so cool when you work hard! 🥰",
    "Faito! Your efforts will pay off! 🌈"
];

const quoteEl = document.getElementById('quote');
const characterEl = document.getElementById('character');

// Change quote randomly
function changeQuote() {
    const speechBubble = document.getElementById('speech-bubble');
    speechBubble.style.animation = 'none';
    speechBubble.offsetHeight; // trigger reflow
    speechBubble.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = randomQuote;
}

// Change on click
characterEl.addEventListener('click', changeQuote);

// Change every 10 seconds
setInterval(changeQuote, 10000);

// Timetable logic
let scheduleData = JSON.parse(localStorage.getItem('moeTimetable')) || [
    { id: 1, day: 1, time: "09:00", text: "Math Class", theme: "pink-theme" },
    { id: 2, day: 2, time: "10:00", text: "Programming", theme: "blue-theme" },
    { id: 3, day: 5, time: "15:00", text: "Anime Time!", theme: "yellow-theme" }
];

const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const tbody = document.querySelector('#timetable tbody');

function renderTimetable() {
    tbody.innerHTML = '';
    
    timeSlots.forEach(time => {
        const tr = document.createElement('tr');
        
        // Time column
        const timeTd = document.createElement('td');
        timeTd.textContent = time;
        timeTd.className = 'time-col';
        tr.appendChild(timeTd);
        
        // Days 1 (Mon) to 7 (Sun)
        for (let day = 1; day <= 7; day++) {
            const td = document.createElement('td');
            
            // Find activities for this time and day
            // Simplified: matching exact time string
            const activities = scheduleData.filter(item => item.day == day && item.time === time);
            
            activities.forEach(activity => {
                const div = document.createElement('div');
                div.className = `activity-card ${activity.theme}`;
                div.textContent = activity.text;
                
                const delBtn = document.createElement('button');
                delBtn.className = 'delete-btn';
                delBtn.innerHTML = '&times;';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteActivity(activity.id);
                };
                
                div.appendChild(delBtn);
                td.appendChild(div);
            });
            
            tr.appendChild(td);
        }
        
        tbody.appendChild(tr);
    });
}

function saveAndRender() {
    localStorage.setItem('moeTimetable', JSON.stringify(scheduleData));
    renderTimetable();
}

function deleteActivity(id) {
    scheduleData = scheduleData.filter(item => item.id !== id);
    saveAndRender();
    
    quoteEl.textContent = "Activity poofed away! 💨";
}

// Modal logic
const modal = document.getElementById('modal');
const addBtn = document.getElementById('add-btn');
const cancelBtn = document.getElementById('cancel-btn');
const addForm = document.getElementById('add-form');

addBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    // Pre-fill time to next hour
    const now = new Date();
    let hour = now.getHours() + 1;
    if(hour < 10) hour = '0' + hour;
    document.getElementById('time-input').value = `${hour}:00`;
});

cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    addForm.reset();
});

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const day = document.getElementById('day-select').value;
    const time = document.getElementById('time-input').value; // In a real app we'd map this to slots better
    const text = document.getElementById('activity-input').value;
    const theme = document.getElementById('color-select').value;
    
    const newActivity = {
        id: Date.now(),
        day: parseInt(day),
        time: time,
        text: text,
        theme: theme
    };
    
    let matchedSlot = timeSlots.find(slot => time.startsWith(slot.split(':')[0]));
    if(!matchedSlot) matchedSlot = "09:00"; // default fallback
    
    newActivity.time = matchedSlot;
    
    scheduleData.push(newActivity);
    saveAndRender();
    
    modal.classList.add('hidden');
    addForm.reset();
    
    // Show a happy message
    quoteEl.textContent = "Yay! New activity added! We can do it! 🌸";
});

// Initial render
renderTimetable();
