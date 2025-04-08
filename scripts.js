let currentHabitIndex = 0;  
fetchHabits();

async function fetchHabits() {
    try {
        const response = await fetch("https://67f56877913986b16fa47860.mockapi.io/habits", {
            method: 'GET',
            headers: {'content-type':'application/json'},
        });

        if (response.ok) {
            const habits = await response.json(); 
            renderHabits(habits);
        } else {
            console.error("Error fetching habits:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching habits:", error);
    }
}

async function markHabitDone(id, isFinished) {
    try {
        const container = document.getElementById("habitsContainer");
        const habitCard = document.getElementById(`habit-${id}`);

        if (habitCard) {
            habitCard.style.opacity = "0.5";
        }

        const response = await fetch(`https://67f56877913986b16fa47860.mockapi.io/habits/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ isdone: isFinished })
        });

        if (response.ok) {
            fetchHabits();
        } else {
            console.error("Error updating habit:", response.statusText);
        }
    } catch (error) {
        console.error("Error updating habit:", error);
    }
}

function renderHabits(habits) {
    const container = document.getElementById("habitsContainer");

    if (!container) return;

    let habitsHTML = "";
    const nextHabitIndex = habits.findIndex((habit, index) => !habit.isdone && index > currentHabitIndex);

    if (nextHabitIndex !== -1) {
        const habit = habits[nextHabitIndex];
        currentHabitIndex = nextHabitIndex;

        habitsHTML += `
        <div class="habit-card active" id="habit-${habit.id}">
            <p class="habit-name">${habit.name}</p>
            <p class="habit-time">${habit.time}</p>
            <p class="habit-category">
              ${habit.category} ${habit.category === "Health" ? "🏋️" : habit.category === "Productivity" ? "📈" : "🛌"} 
            </p>
            <p class="habit-streak">${habit.streak} day${habit.streak > 1 ? 's' : ''} streak ${habit.streak > 1 ? "🔥" : "🚀"}</p>

            <div class="habit-streak"">Goal: ${habit.streak}/${habit.goal} days 🏁</div>
            <div class="icon-container">
                <label class="finished" onclick="markHabitDone(${habit.id}, true)">
                    <i class="fas fa-check-circle"></i>
                </label>
                <label class="unfinished" onclick="markHabitDone(${habit.id}, false)">
                    <i class="fas fa-times-circle"></i>
                </label>
            </div>
        </div>`;
    } else {
        habitsHTML = `<p class="habits-finished">No habits left to complete!</p>
        <p class="habits-finished">🎉 🎉 🎉</p>
        <p class="habits-finished">Good job!</p>`;
    }

    container.innerHTML = habitsHTML;
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

async function addHabit() {
    const habitTitle = document.getElementById('habitTitle').value;
    const habitTime = document.getElementById('habitTime').value;
    const habitCategory = document.getElementById('habitCategory').value;
    const habitGoal = document.getElementById('habitGoal').value;

    if (habitTitle && habitTime) {
        const newHabit = {
            name: habitTitle,
            time: habitTime,
            category: habitCategory,
            goal: habitGoal,
            isdone: false,
            streak: 0,
        };

        try {
            const response = await fetch("https://67f56877913986b16fa47860.mockapi.io/habits", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newHabit),
            });

            if (response.ok) {
                fetchHabits(); 
                closeModal();
            } else {
                console.error("Error adding habit:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding habit:", error);
        }
    }
}
