let currentStep = 1;

function nextStep(step) {
    let currentInput = document.querySelector(`#step${step} input, #step${step} select`);
    if (currentInput.value.trim() === "") {
        alert("Please fill in this field before proceeding.");
        return;
    }
    currentStep++;
    let nextStepElement = document.getElementById('step' + currentStep);
    if (nextStepElement) {
        nextStepElement.classList.add('active');
    }
    currentInput.disabled = true;
    document.querySelector(`#step${step} .btn-next`).style.display = 'none';
    if (step === 5) {
        document.getElementById('submitButton').style.display = 'block';
    }
}

function submitForm() {
    let name = document.getElementById('name').value;
    let username = document.getElementById('username').value;
    let age = document.getElementById('age').value;
    let gender = document.getElementById('gender').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    console.log("Name:", name);
    console.log("Username:", username);
    console.log("Age:", age);
    console.log("Gender:", gender);
    console.log("Email:", email);
    console.log("Password:", password);
}