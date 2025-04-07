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
            <p class="habit-streak">${habit.streak} day${habit.streak > 1 ? 's' : ''} streak ${habit.streak > 1 ? "🔥" : "🚀"}</p>
                <div class="icon-container">
                    <label class="finished" onclick="markHabitDone(${habit.id}, true)">
                        <i class="fas fa-check-circle"></i>
                        <span class="text"></span>
                    </label>
                    <label class="unfinished" onclick="markHabitDone(${habit.id}, false)">
                        <i class="fas fa-times-circle"></i>
                        <span class="text"></span>
                    </label>
                </div>
        </div>
        `;
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

        // If the habit is marked as finished, it will be removed from the list
        if (isFinished) {
            habits.splice(habitIndex, 1);
        }

        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits(habits);
    }
}

window.onload = () => {
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

function showApp() {
    localStorage.setItem('introSeen', 'true');

    document.querySelector('.intro').style.display = 'none';
    document.querySelector('main').classList.remove('hidden');
    document.querySelector('.main-page-title').classList.remove('hidden');
}


function openModal() {
    document.getElementById('habitModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('habitModal').style.display = 'none';
}
function addHabit() {
    const habitTitle = document.getElementById('habitTitle').value;
    const habitTime = document.getElementById('habitTime').value;

    if (habitTitle && habitTime) {
        let habits = JSON.parse(localStorage.getItem('habits')) || [];

        const nextId = habits.length > 0 ? Math.max(...habits.map(habit => habit.id)) + 1 : 1;

        const newHabit = {
            id: nextId,
            name: habitTitle,
            time: habitTime,
            isdone: false,
            streak: 0
        };
        habits.push(newHabit);

        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits(habits);

        closeModal();
    }
}

