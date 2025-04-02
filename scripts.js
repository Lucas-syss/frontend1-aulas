const habit =  {
    id: 1,
    name: "habit 1",
    isdone: "false",
    streak: "streak",
}

const habitList = [
    habit
]

function showApp() {
    document.querySelector('.intro').style.display = 'none';

    document.querySelector('main').classList.remove('hidden');
}

function openModal() {
    document.getElementById('habitModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('habitModal').style.display = 'none';
}

function addHabit() {
    const habitTitle = document.getElementById('habitTitle').value;
    if (habitTitle) {
        const newHabit = document.createElement('li');
        newHabit.innerHTML = `<input type="checkbox"> ${habitTitle}`;
        document.querySelector('.habits ul').appendChild(newHabit);
        closeModal();
    }
}
