document.addEventListener("DOMContentLoaded", function () {
    const dietPlan = document.getElementById('diet-plan');
    const addButton = document.getElementById('add-plan');
    const saveButton = document.getElementById('save');

    const currentDate = new Date().toLocaleDateString();
    const savedData = JSON.parse(localStorage.getItem('dietPlanData')) || {};
    const savedDate = savedData.date;
    const savedState = savedData.state || [];

    // Function to create a plan item
    function createPlanItem(time = '', checked = false) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="text" value="${time}" placeholder="Enter time and meal">
            <input type="checkbox" ${checked ? 'checked' : ''}>
            <button class="delete">X</button>
        `;

        const deleteButton = li.querySelector('.delete');
        deleteButton.addEventListener('click', () => {
            li.remove();
        });

        dietPlan.appendChild(li);
    }

    // Check if the saved date is today; if not, start a new day
    if (savedDate === currentDate) {
        savedState.forEach(item => {
            createPlanItem(item.time, item.checked);
        });
    } else {
        // Save the old plan in memory
        if (savedDate) {
            localStorage.setItem('previousDietPlan', JSON.stringify(savedState));
        }
        // Start a new plan for today
        localStorage.setItem('dietPlanData', JSON.stringify({ date: currentDate, state: [] }));
    }

    // Add a new plan item
    addButton.addEventListener('click', function () {
        createPlanItem();
    });

    // Save the state to localStorage when the save button is clicked
    saveButton.addEventListener('click', function () {
        const planItems = document.querySelectorAll('#diet-plan li');
        const state = Array.from(planItems).map(item => ({
            time: item.querySelector('input[type="text"]').value,
            checked: item.querySelector('input[type="checkbox"]').checked
        }));

        localStorage.setItem('dietPlanData', JSON.stringify({ date: currentDate, state: state }));
        alert('Diet plan saved!');
    });

    // Function to reset the plan at midnight
    function resetAtMidnight() {
        const now = new Date();
        const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) - now;

        setTimeout(() => {
            localStorage.setItem('previousDietPlan', localStorage.getItem('dietPlanData'));
            localStorage.setItem('dietPlanData', JSON.stringify({ date: new Date().toLocaleDateString(), state: [] }));
            dietPlan.innerHTML = '';
            resetAtMidnight(); // Re-register the timeout for the next midnight
        }, msToMidnight);
    }

    resetAtMidnight();
});
