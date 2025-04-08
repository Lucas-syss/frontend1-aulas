fetchHabits();

async function fetchHabits() {
    let habits = JSON.parse(localStorage.getItem('habits'));
    if (!habits) {
        try {
            const response = await fetch("data.json");
            const data = await response.json();
            if (data.habit) {
                habits = data.habit;
                localStorage.setItem('habits', JSON.stringify(habits));
            }
        } catch (error) {
            console.error("Error fetching habits:", error);
        }
    }

    if (habits) {
        renderHabits(habits);
    }
}

function renderHabits(habits) {
    const container = document.getElementById("habitsContainer");

    if (!container) return;

    let habitsHTML = "";
    const currentHabitIndex = habits.findIndex(habit => !habit.isdone);

    if (currentHabitIndex !== -1) {
        const habit = habits[currentHabitIndex];

        habitsHTML += `
        <div class="habit-card active" id="habit-${habit.id}">
            <p class="habit-name">${habit.name}</p>
            <p class="habit-time">${habit.time}</p>
            <p class="habit-category">
              ${habit.category} ${habit.category === "Health" ? "🏋️" : habit.category === "Productivity" ? "📈" : "🛌"} 
            </p>
            <p class="habit-streak">${habit.streak} day${habit.streak > 1 ? 's' : ''} streak ${habit.streak > 1 ? "🔥" : "🚀"}</p>
            <div class="streak-progress-bar">
                <div class="streak-progress" style="width: ${(habit.streak / 30) * 100}%"></div>
            </div>
            <div class="icon-container">
                <label class="finished" onclick="markHabitDone(${habit.id}, true)">
                    <i class="fas fa-check-circle"></i>
                </label>
                <label class="unfinished" onclick="markHabitDone(${habit.id}, false)">
                    <i class="fas fa-times-circle"></i>
                </label>
            </div>
        </div>`;

        if (habit.streak >= habit.goal) {
            alert(`Congrats! You’ve reached your streak goal for "${habit.name}"!`);
        }
    } else {
        habitsHTML = `<p class="habits-finished">No habits left to complete!</p>
        <p class="habits-finished">Good job!</p>`;
    }

    container.innerHTML = habitsHTML;
}

function markHabitDone(id, isFinished) {
    let habits = JSON.parse(localStorage.getItem('habits')) || [];

    const habitIndex = habits.findIndex(habit => habit.id === id);

    if (habitIndex !== -1) {
        habits[habitIndex].isdone = isFinished;

        if (isFinished) {
            habits.splice(habitIndex, 1);
        }

        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits(habits);
    }
}

window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(savedTheme);

    const introSeen = localStorage.getItem('introSeen');

    if (introSeen === 'true') {
        document.querySelector('.intro').style.display = 'none';
        document.querySelector('main').classList.remove('hidden');
        document.querySelector('.main-page-title').classList.remove('hidden');
    } else {
        document.querySelector('.intro').style.display = 'block';
        document.querySelector('main').classList.add('hidden');
    }
};

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.classList.remove(currentTheme);
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
}

function showApp() {
    localStorage.setItem('introSeen', 'true');

    document.querySelector('.intro').style.display = 'none';
    document.querySelector('main').classList.remove('hidden');
    document.querySelector('.main-page-title').classList.remove('hidden');
}

function openModal() {
    const modal = document.getElementById('habitModal');
    const overlay = document.getElementById('modalOverlay');

    overlay.style.display = 'block';
    modal.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('show');
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('habitModal');
    const overlay = document.getElementById('modalOverlay');

    modal.classList.remove('show');
    overlay.classList.remove('show');

    setTimeout(() => {
        overlay.style.display = 'none';
        modal.style.display = 'none';
    }, 300);
}

document.getElementById('modalOverlay').addEventListener('click', (e) => {
    const modal = document.getElementById('habitModal');
    if (!modal.contains(e.target)) {
        closeModal();
    }
});

function addHabit() {
    const habitTitle = document.getElementById('habitTitle').value;
    const habitTime = document.getElementById('habitTime').value;
    const habitCategory = document.getElementById('habitCategory').value;
    const habitGoal = document.getElementById('habitGoal').value;

    if (habitTitle && habitTime) {
        let habits = JSON.parse(localStorage.getItem('habits')) || [];

        const nextId = habits.length > 0 ? Math.max(...habits.map(habit => habit.id)) + 1 : 1;

        const newHabit = {
            id: nextId,
            name: habitTitle,
            time: habitTime,
            category: habitCategory,
            goal: habitGoal,
            isdone: false,
            streak: 0,
            history: []
        };
        habits.push(newHabit);

        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits(habits);

        closeModal();
    }
}

