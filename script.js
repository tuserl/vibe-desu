let currentLang = localStorage.getItem('moeLang') || 'en';

const translations = {
    en: {
        title: "✨ My Moe Timetable ✨",
        subtitle: "Let's do our best today!",
        addBtn: "🌸 Add Activity",
        timeDay: "Time / Day",
        saveBtn: "💾 Save JSON",
        loadBtn: "📂 Load JSON",
        modalTitle: "Add New Activity ✏️",
        dayLabel: "Day:",
        timeLabel: "Time (e.g., 09:00):",
        activityLabel: "Activity:",
        hoverLabel: "Anime Girl Message (Hover) [EN]:",
        hoverLabelVi: "Anime Girl Message (Hover) [VI]:",
        colorLabel: "Color:",
        cancelBtn: "Cancel",
        saveModalBtn: "Save",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        colors: {
            "pink-theme": "Sakura Pink",
            "blue-theme": "Sky Blue",
            "purple-theme": "Lavender",
            "yellow-theme": "Sunshine",
            "mint-theme": "Mint Green"
        },
        quotes: [
            "Senpai, you're doing great! Keep it up! 💖",
            "Ganbatte! I believe in you! ✨",
            "One iteration at a time! We got this! 🌸",
            "Don't give up! Look how far you've come! 🌟",
            "Make today amazing, Master! 🎀",
            "Remember to take breaks and drink water! ☕",
            "You are so cool when you work hard! 🥰",
            "Faito! Your efforts will pay off! 🌈"
        ],
        deletedMsg: "Activity poofed away! 💨",
        addedMsg: "Yay! New activity added! We can do it! 🌸",
        savedMsg: "Data saved safely! Great job! 💾",
        loadedMsg: "Timetable loaded perfectly! Ready to go! 📂",
        loadErrMsg: "Oops! That file looks a little strange... 😵‍💫"
    },
    vi: {
        title: "✨ Thời Khoá Biểu Moe ✨",
        subtitle: "Hôm nay hãy cố gắng hết sức nhé!",
        addBtn: "🌸 Thêm Hoạt Động",
        timeDay: "Thời Gian / Ngày",
        saveBtn: "💾 Lưu JSON",
        loadBtn: "📂 Tải JSON",
        modalTitle: "Thêm Hoạt Động Mới ✏️",
        dayLabel: "Ngày:",
        timeLabel: "Thời gian (VD: 09:00):",
        activityLabel: "Hoạt động:",
        hoverLabel: "Lời nhắn của nhân vật [EN]:",
        hoverLabelVi: "Lời nhắn của nhân vật [VI]:",
        colorLabel: "Màu sắc:",
        cancelBtn: "Hủy",
        saveModalBtn: "Lưu",
        days: ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"],
        colors: {
            "pink-theme": "Hồng Sakura",
            "blue-theme": "Xanh Da Trời",
            "purple-theme": "Tím Lavender",
            "yellow-theme": "Vàng Nắng",
            "mint-theme": "Xanh Bạc Hà"
        },
        quotes: [
            "Senpai, anh làm tốt lắm! Cố lên nhé! 💖",
            "Ganbatte! Em tin ở anh! ✨",
            "Cứ từng bước một thôi! Chúng ta làm được mà! 🌸",
            "Đừng bỏ cuộc! Hãy nhìn xem anh đã tiến xa thế nào! 🌟",
            "Làm cho hôm nay thật tuyệt vời nhé, Chủ nhân! 🎀",
            "Nhớ nghỉ ngơi và uống nước nha! ☕",
            "Anh ngầu lắm lúc chăm chỉ đấy! 🥰",
            "Faito! Nỗ lực của anh sẽ được đền đáp! 🌈"
        ],
        deletedMsg: "Hoạt động đã bay màu! 💨",
        addedMsg: "Yay! Hoạt động mới đã được thêm! Chúng ta làm được! 🌸",
        savedMsg: "Dữ liệu được lưu an toàn! Giỏi quá! 💾",
        loadedMsg: "Thời khoá biểu tải hoàn hảo! Sẵn sàng thôi! 📂",
        loadErrMsg: "Oops! File đó có vẻ hơi lạ lạ... 😵‍💫"
    }
};

// Motivational quotes
let quotes = translations[currentLang].quotes;

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

// Timetable logic defaults
let scheduleData = JSON.parse(localStorage.getItem('moeTimetable')) || [];
let timeSlots = JSON.parse(localStorage.getItem('moeTimeSlots')) || [];
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
    thCorner.textContent = translations[currentLang].timeDay;
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
            const activities = scheduleData.filter(item => item.day == day && item.time === time);

            activities.forEach(activity => {
                const div = document.createElement('div');
                div.className = `activity-card ${activity.theme}`;
                div.textContent = activity.text;

                const msgEn = activity['message of anime girl when hover'] || "We got this! 💖";
                const msgVi = activity['message_vi'] || msgEn;
                const tooltipMsg = currentLang === 'vi' ? msgVi : msgEn;

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

    quoteEl.textContent = translations[currentLang].deletedMsg;
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
    if (hour < 10) hour = '0' + hour;
    document.getElementById('time-input').value = `${hour}:00`;
});

cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    addForm.reset();
});

addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const day = document.getElementById('day-select').value;
    const time = document.getElementById('time-input').value;
    const text = document.getElementById('activity-input').value;
    const theme = document.getElementById('color-select').value;
    const hoverMessage = document.getElementById('hover-message-input').value;
    const hoverMessageVi = document.getElementById('hover-message-vi-input').value;

    const newActivity = {
        id: Date.now(),
        day: parseInt(day),
        time: time,
        text: text,
        theme: theme,
        "message of anime girl when hover": hoverMessage || "We got this! 💖",
        "message_vi": hoverMessageVi || "Cố lên nhé! 💖"
    };

    let matchedSlot = timeSlots.find(slot => time.startsWith(slot.split(':')[0]));
    if (!matchedSlot) matchedSlot = "09:00";

    newActivity.time = matchedSlot;

    scheduleData.push(newActivity);
    saveAndRender();

    modal.classList.add('hidden');
    addForm.reset();

    quoteEl.textContent = translations[currentLang].addedMsg;
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
    quoteEl.textContent = translations[currentLang].savedMsg;
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

            // --- Detect language from JSON days or activity messages ---
            const viDays = translations.vi.days;
            const enDays = translations.en.days;

            let detectedLang = currentLang;

            // Detect by days array
            if (parsed.days && Array.isArray(parsed.days)) {
                const hasVietnameseDays = parsed.days.some((d, i) => d === viDays[i]);
                const hasEnglishDays = parsed.days.some((d, i) => d === enDays[i]);

                if (hasVietnameseDays) {
                    detectedLang = 'vi';
                } else if (hasEnglishDays) {
                    detectedLang = 'en';
                }
            }

            // Detect by Vietnamese hover messages if days are custom
            if (parsed.scheduleData && Array.isArray(parsed.scheduleData)) {
                const hasViMessages = parsed.scheduleData.some(item => item.message_vi && item.message_vi.trim() !== "");
                const hasEnMessages = parsed.scheduleData.some(item => item["message of anime girl when hover"] && item["message of anime girl when hover"].trim() !== "");

                if (hasViMessages && !parsed.days) {
                    detectedLang = 'vi';
                } else if (hasEnMessages && !parsed.days) {
                    detectedLang = 'en';
                }
            }

            // Save loaded data first
            localStorage.setItem('moeTimetable', JSON.stringify(scheduleData));
            localStorage.setItem('moeTimeSlots', JSON.stringify(timeSlots));
            localStorage.setItem('moeDays', JSON.stringify(days));

            // Apply detected language (this also re-renders)
            setLanguage(detectedLang);

            // Show loaded message in correct language
            quoteEl.textContent = translations[detectedLang].loadedMsg;

        } catch (err) {
            console.error("JSON load error:", err);
            quoteEl.textContent = translations[currentLang].loadErrMsg;
        }

        fileInput.value = ''; // Reset input
    };

    reader.readAsText(file, 'UTF-8');
});

// Initial render will be handled by setLanguage()

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('moeLang', lang);
    const t = translations[lang];
    quotes = t.quotes;

    document.querySelector('header h1').textContent = t.title;
    document.querySelector('header p').textContent = t.subtitle;
    document.getElementById('add-btn').textContent = t.addBtn;
    document.getElementById('save-btn').textContent = t.saveBtn;
    document.getElementById('load-btn').textContent = t.loadBtn;

    document.querySelector('.modal-content h2').textContent = t.modalTitle;
    const labels = document.querySelectorAll('.modal-content label');
    if (labels.length >= 6) {
        labels[0].textContent = t.dayLabel;
        labels[1].textContent = t.timeLabel;
        labels[2].textContent = t.activityLabel;
        labels[3].textContent = t.hoverLabel;
        labels[4].textContent = t.hoverLabelVi;
        labels[5].textContent = t.colorLabel;
    }

    document.getElementById('cancel-btn').textContent = t.cancelBtn;
    document.querySelector('.modal-actions button[type="submit"]').textContent = t.saveModalBtn;

    // Update color select options
    const colorSelect = document.getElementById('color-select');
    if (colorSelect) {
        Array.from(colorSelect.options).forEach(opt => {
            opt.textContent = t.colors[opt.value];
        });
    }

    // Translate default day names only if unchanged
    const enDays = translations['en'].days;
    const viDays = translations['vi'].days;

    // Only auto-translate if current days are still standard weekday names
    const isStandardWeek = days.length === 7 && days.every((d, i) =>
        d === enDays[i] || d === viDays[i]
    );

    if (isStandardWeek) {
        days = [...t.days];
    }

    saveAndRender();
    changeQuote();
}

// Language buttons
document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
document.getElementById('lang-vi').addEventListener('click', () => setLanguage('vi'));

// Load data and init
async function initApp() {
    try {
        // Try to read directly from sample JSON file
        const res = await fetch('sample_timetable.json');
        if (res.ok) {
            const data = await res.json();
            if (data.scheduleData) scheduleData = data.scheduleData;
            if (data.timeSlots) timeSlots = data.timeSlots;
            if (data.days) days = data.days;
            console.log("Loaded data from sample_timetable.json!");
        }
    } catch (err) {
        console.log("Could not fetch sample_timetable.json (might be local file block), falling back to local storage or defaults.");

        // Only set defaults if localStorage is empty
        if (scheduleData.length === 0) {
            scheduleData = [
                {
                    id: 1,
                    day: 1,
                    time: "09:00",
                    text: "Vật lý (2h)",
                    theme: "blue-theme",
                    "message of anime girl when hover": "Big brain physics time! Let's conquer the hard stuff first! ⚡",
                    "message_vi": "Đến giờ vật lý đại não rồi! Xử lý môn khó trước nào! ⚡"
                },
                {
                    id: 2,
                    day: 1,
                    time: "11:00",
                    text: "Văn (30m)",
                    theme: "pink-theme",
                    "message of anime girl when hover": "A gentle cooldown~ Literature will balance your brain nicely! 🌸",
                    "message_vi": "Thư giãn nhẹ nhàng nào~ Văn sẽ cân bằng bộ não của anh đó! 🌸"
                },
                {
                    id: 3,
                    day: 1,
                    time: "14:00",
                    text: "Toán (2h)",
                    theme: "purple-theme",
                    "message of anime girl when hover": "Math combo time! Keep the momentum going, Master! ✨",
                    "message_vi": "Đến giờ combo Toán rồi! Giữ nhịp học tập nào, Chủ nhân! ✨"
                },
                {
                    id: 4,
                    day: 1,
                    time: "16:00",
                    text: "Shader Unity (2h)",
                    theme: "mint-theme",
                    "message of anime girl when hover": "Now the creative tech magic begins~ Make those shaders sparkle! 💎",
                    "message_vi": "Giờ là lúc ma thuật công nghệ sáng tạo bắt đầu~ Làm shader lấp lánh nào! 💎"
                },
                {
                    id: 5,
                    day: 1,
                    time: "18:00",
                    text: "Vẽ (1h)",
                    theme: "yellow-theme",
                    "message of anime girl when hover": "Drawing at the end? So elegant~ Let your creativity relax your heart! 🎨",
                    "message_vi": "Vẽ vào cuối ngày à? Thanh lịch ghê~ Để sáng tạo xoa dịu trái tim nhé! 🎨"
                },
                {
                    id: 6,
                    day: 1,
                    time: "19:00",
                    text: "Nhật (1 từ)",
                    theme: "pink-theme",
                    "message of anime girl when hover": "Just one word a day~ Tiny progress is still progress! 🇯🇵",
                    "message_vi": "Mỗi ngày chỉ 1 từ thôi~ Tiến bộ nhỏ vẫn là tiến bộ đó! 🇯🇵"
                }
            ];

            timeSlots = [
                "09:00",
                "11:00",
                "14:00",
                "16:00",
                "18:00",
                "19:00"
            ];

            days = [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ];
        }
    }

    // Init language texts and render timetable
    setLanguage(currentLang);
}

initApp();