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

let quoteInterval;

// Change quote randomly
function changeQuote() {
    const speechBubble = document.getElementById('speech-bubble');
    speechBubble.style.animation = 'none';
    speechBubble.offsetHeight; // trigger reflow
    speechBubble.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = randomQuote;
}

function startQuoteTimer() {
    clearInterval(quoteInterval);
    quoteInterval = setInterval(changeQuote, 10000);
}

// Change on click
characterEl.addEventListener('click', () => {
    changeQuote();
    startQuoteTimer();
});

// Change every 10 seconds
startQuoteTimer();

// Timetable logic
let scheduleData = JSON.parse(localStorage.getItem('moeTimetable')) || [
    { id: 1, day: 1, time: "09:00", text: "Math Class", theme: "pink-theme", "message of anime girl when hover": "You can solve anything, Master!" },
    { id: 2, day: 2, time: "10:00", text: "Programming", theme: "blue-theme", "message of anime girl when hover": "Your code is so clean! ✨" },
    { id: 3, day: 5, time: "15:00", text: "Anime Time!", theme: "yellow-theme", "message of anime girl when hover": "Yay! Time to relax together! 🌸" }
];

let timeSlots = JSON.parse(localStorage.getItem('moeTimeSlots')) || [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

let days = JSON.parse(localStorage.getItem('moeDays')) || [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const thead = document.querySelector('#timetable-head');
const tbody = document.querySelector('#timetable tbody');

function renderTimetable() {
    // Render headers
    thead.innerHTML = '';
    const headerTr = document.createElement('tr');
    const thCorner = document.createElement('th');
    thCorner.textContent = 'Time / Day';
    headerTr.appendChild(thCorner);
    
    days.forEach((dayName, index) => {
        const th = document.createElement('th');
        th.textContent = dayName;
        th.contentEditable = "true";
        th.addEventListener('blur', (e) => {
            days[index] = e.target.textContent;
            saveAndRender();
        });
        headerTr.appendChild(th);
    });
    thead.appendChild(headerTr);

    // Update modal select day options
    const daySelect = document.getElementById('day-select');
    if (daySelect) {
        daySelect.innerHTML = '';
        days.forEach((dayName, index) => {
            const opt = document.createElement('option');
            opt.value = index + 1;
            opt.textContent = dayName;
            daySelect.appendChild(opt);
        });
    }

    tbody.innerHTML = '';
    
    timeSlots.forEach(time => {
        const tr = document.createElement('tr');
        
        // Time column
        const timeTd = document.createElement('td');
        timeTd.textContent = time;
        timeTd.className = 'time-col';
        timeTd.contentEditable = "true";
        timeTd.addEventListener('blur', (e) => {
            const newTime = e.target.textContent;
            if (newTime !== time) {
                scheduleData.forEach(act => {
                    if (act.time === time) act.time = newTime;
                });
                timeSlots[timeSlots.indexOf(time)] = newTime;
                saveAndRender();
            }
        });
        tr.appendChild(timeTd);
        
        // Days 1 (Mon) to 7 (Sun)
        for (let day = 1; day <= days.length; day++) {
            const td = document.createElement('td');
            
            // Find activities for this time and day
            // Simplified: matching exact time string
            const activities = scheduleData.filter(item => item.day == day && item.time === time);
            
            activities.forEach(activity => {
                const div = document.createElement('div');
                div.className = `activity-card ${activity.theme}`;
                div.textContent = activity.text;
                const tooltipMsg = activity['message of anime girl when hover'] || "We got this! 💖";
                
                // Show tooltip in the anime character's speech bubble
                div.addEventListener('mouseenter', () => {
                    const speechBubble = document.getElementById('speech-bubble');
                    speechBubble.style.animation = 'none';
                    speechBubble.offsetHeight;
                    speechBubble.style.animation = 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    quoteEl.textContent = tooltipMsg;
                    startQuoteTimer();
                });
                
                div.addEventListener('mouseleave', () => {
                    changeQuote();
                    startQuoteTimer();
                });
                
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
    localStorage.setItem('moeTimeSlots', JSON.stringify(timeSlots));
    localStorage.setItem('moeDays', JSON.stringify(days));
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
    const hoverMessage = document.getElementById('hover-message-input').value;
    
    const newActivity = {
        id: Date.now(),
        day: parseInt(day),
        time: time,
        text: text,
        theme: theme,
        "message of anime girl when hover": hoverMessage || "We got this! 💖"
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

// JSON Export and Import
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const fileInput = document.getElementById('file-input');

saveBtn.addEventListener('click', () => {
    const data = {
        scheduleData,
        timeSlots,
        days
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moe-timetable.json';
    a.click();
    URL.revokeObjectURL(url);
    quoteEl.textContent = "Data saved safely! Great job! 💾";
});

loadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const parsed = JSON.parse(event.target.result);
            if (parsed.scheduleData) scheduleData = parsed.scheduleData;
            if (parsed.timeSlots) timeSlots = parsed.timeSlots;
            if (parsed.days) days = parsed.days;
            saveAndRender();
            quoteEl.textContent = "Timetable loaded perfectly! Ready to go! 📂";
        } catch (err) {
            quoteEl.textContent = "Oops! That file looks a little strange... 😵‍💫";
        }
        fileInput.value = ''; // Reset
    };
    reader.readAsText(file);
});

// Initial render
renderTimetable();
