

let currentHabitIndex = 0;
fetchHabits();

function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);
updateClock();


async function fetchHabits() {
    try {
        const response = await fetch("https://67f56877913986b16fa47860.mockapi.io/habits", {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
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
        const habitResponse = await fetch(`https://67f56877913986b16fa47860.mockapi.io/habits/${id}`);
        const habit = await habitResponse.json();

       
        let newStreak = habit.streak;
        if (isFinished && !habit.isdone) {
            newStreak += 1; 
        } else if (!isFinished && habit.isdone) {
            newStreak = Math.max(0, newStreak - 1); 
        }

        const response = await fetch(`https://67f56877913986b16fa47860.mockapi.io/habits/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                isdone: isFinished,
                streak: newStreak,
            })
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

    // maybe implement ?
    //const habitsRemaining = habits.filter(habit => !habit.isDone).length;
    //<p class="habitsRemaining">${currentHabitIndex}/${habitsRemaining}</p>

    habits.sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.time.padStart(5, '0')}:00`);
        const timeB = new Date(`1970-01-01T${b.time.padStart(5, '0')}:00`);
        return timeA - timeB;
    });

    let habitsHTML = "";
    const nextHabitIndex = habits.findIndex((habit, index) => !habit.isdone && index >= currentHabitIndex);
    
    if (nextHabitIndex !== -1) {
        const habit = habits[nextHabitIndex];
        currentHabitIndex = nextHabitIndex;
        const progressPercentage = (habit.streak / habit.goal) * 100;

        habitsHTML += `
        <div class="habit-card active" id="habit-${habit.id}">
            <progress-circle progress="${progressPercentage}" size="100"></progress-circle>
            <label class="edit" onclick="editHabit(${habit.id})">
                <i class="fas fa-edit"></i>
            </label>
            <label class="delete" onclick="deleteHabit(${habit.id})">
                <i class="fas fa-trash"></i>
            </label>
            <p class="habit-name">${habit.name}</p>
            <p class="habit-time">${habit.time}</p>
            <p class="habit-category">
              ${habit.category} ${habit.category === "Health" ? "🏋️" : habit.category === "Productivity" ? "📈" : "🛌"} 
            </p>
            <p class="habit-streak">${habit.streak} day${habit.streak > 1 ? 's' : ''} streak ${habit.streak > 1 ? "🔥" : "🚀"}</p>
            <div class="habit-streak ${habit.streak >= habit.goal ? 'goal-completed' : ''}">Goal: ${habit.streak}/${habit.goal} days 🏁</div>
            <div class="icon-container">
                <label class="finished" onclick="markHabitDone(${habit.id}, true)">
                    <i class="fas fa-check-circle"></i>
                </label>
                <label class="unfinished" onclick="handleUnfinished(${habit.id})">
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


function handleUnfinished(id) {
    markHabitDone(id, false);
    currentHabitIndex++;
    fetchHabits();
}

//remove for better lighthouse score
async function fetchQuote() {
    try {
        const response = await fetch("https://api.quotable.io/random");
        if (!response.ok) throw new Error("Network response was not ok.");

        const data = await response.json();

        const quoteContainer = document.getElementById("quoteContainer");
        if (quoteContainer) {
            quoteContainer.innerHTML = `
                <p class="quote-text">${data.content}</p>
                <p class="quote-author">- ${data.author}</p>
            `;
        }
    } catch {
        // Silently fail
        const quoteContainer = document.getElementById("quoteContainer");
        if (quoteContainer) quoteContainer.innerHTML = '';
    }
}

function renderQuote(data) {
    const quoteContainer = document.getElementById('quoteContainer');
    quoteContainer.innerHTML = `
        <p>"${data.content}"</p>
        <p>- ${data.author}</p>
    `;
}

window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(savedTheme);

    const introSeen = localStorage.getItem('introSeen');

    if (introSeen === 'true') {
        document.querySelector('.intro').style.display = 'none';
        document.querySelector('main').classList.remove('hidden');
        document.querySelector('.main-page-title').classList.remove('hidden');
        fetchQuote(); // remove for better lighthouse score
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

    const icon = document.querySelector('#themeToggle i');
    if (newTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
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

function editHabit(id) {
    fetch(`https://67f56877913986b16fa47860.mockapi.io/habits/${id}`)
        .then(response => response.json())
        .then(habit => {
            document.getElementById('habitTitle').value = habit.name;
            document.getElementById('habitTime').value = habit.time;
            document.getElementById('habitCategory').value = habit.category;
            document.getElementById('habitGoal').value = habit.goal;

            const modal = document.getElementById('habitModal');
            modal.setAttribute('data-habit-id', habit.id);

            document.getElementById('modalTitle').textContent = 'Edit Habit';
            document.getElementById('modalButton').textContent = 'Confirm';

            openModal();
        })
        .catch(error => console.error("Error fetching habit:", error));
}

async function deleteHabit(id) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`https://67f56877913986b16fa47860.mockapi.io/habits/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                await Swal.fire(
                    'Deleted!',
                    'Your habit has been deleted.',
                    'success'
                );
                fetchHabits();
            } else {
                Swal.fire('Error!', 'Failed to delete the habit.', 'error');
                console.error("Error deleting habit:", response.statusText);
            }
        } catch (error) {
            Swal.fire('Error!', 'Something went wrong.', 'error');
            console.error("Error deleting habit:", error);
        }
    }
}



function openNewHabitModal() {
    document.getElementById('habitTitle').value = '';
    document.getElementById('habitTime').value = '';
    document.getElementById('habitCategory').value = 'Health';
    document.getElementById('habitGoal').value = '';

    document.getElementById('modalTitle').textContent = 'Add a New Habit';
    document.getElementById('modalButton').textContent = 'Add';

    const modal = document.getElementById('habitModal');
    modal.removeAttribute('data-habit-id');

    openModal();
}

async function addHabit() {
    const habitTitle = document.getElementById('habitTitle').value;
    const habitTime = document.getElementById('habitTime').value;
    const habitCategory = document.getElementById('habitCategory').value;
    const habitGoal = document.getElementById('habitGoal').value;

    if (habitTitle.length > 20) {
        alert("Habit title must be 20 characters or less");
        return
    }

    const habitId = document.getElementById('habitModal').getAttribute('data-habit-id');
    const isEditing = habitId !== null;

    const habitData = {
        name: habitTitle,
        time: habitTime,
        category: habitCategory,
        goal: habitGoal,
        isdone: false,
        streak: 0,
    };

    try {
        let response;

        if (isEditing) {
            const habit = await fetch(`https://67f56877913986b16fa47860.mockapi.io/habits/${habitId}`).then(res => res.json());
            habitData.streak = habit.streak;

            response = await fetch(`https://67f56877913986b16fa47860.mockapi.io/habits/${habitId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habitData),
            });
        } else {
            response = await fetch("https://67f56877913986b16fa47860.mockapi.io/habits", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habitData),
            });
        }

        if (response.ok) {
            fetchHabits();
            closeModal();
        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
