fetchHabits();

async function fetchHabits() {
    try {
        const response = await fetch("data.json");
        const data = await response.json();

        if (data.habit) {
            renderHabits(data.habit);
        }
    } catch (error) {
        console.error("Error fetching habits:", error);
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
                <p class="habit-streak">Streak: ${habit.streak} day${habit.streak > 1 ? 's' : ''}</p>
                <label>
                    <input type="checkbox" class="habit-checkbox" 
                    ${habit.isdone ? 'checked' : ''} 
                    onchange="markHabitDone(${habit.id}, this)">
                    Complete
                </label>
            </div>
        `;
    } else {
        habitsHTML = `<p>No habits left to complete!</p>`;
    }

    container.innerHTML = habitsHTML;
}

function markHabitDone(id, checkbox) {
    fetch("data.json")
        .then((response) => response.json())
        .then((data) => {
            const habits = data.habit;
            const habitIndex = habits.findIndex(habit => habit.id === id);

            if (habitIndex !== -1) {
                habits[habitIndex].isdone = checkbox.checked;
            }
            renderHabits(habits);
        })
        .catch((error) => {
            console.error("Error fetching habits:", error);
        });
}

function showApp() {
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
        fetch("data.json")
            .then((response) => response.json())
            .then((data) => {
                const habits = data.habit;

                const newHabit = {
                    id: Date.now(),
                    name: habitTitle,
                    time: habitTime,
                    isdone: false,
                    streak: 0
                };
                habits.push(newHabit);
                renderHabits(habits);
                closeModal();
            })
            .catch((error) => {
                console.error("Error adding habit:", error);
            });
    }
}
