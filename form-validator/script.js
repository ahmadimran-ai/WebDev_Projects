const form = document.getElementById("registration-form");

const username = document.getElementById("username");

const email = document.getElementById("email");

const password = document.getElementById("password");

const confirmPassword = document.getElementById("confirmPassword");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isRequiredValid = checkRequired([
        username,
        email,
        password,
        confirmPassword,
    ]);

    let isFormValid = isRequiredValid;

    if (isRequiredValid) {
        const isUsernameValid = checkLength(username, 3, 15);

        const isEmailValid = checkEmail(email);

        const isPasswordValid = checkLength(password, 6, 25);

        const isPasswordsMatch = checkPasswordsMatch(
            password,
            confirmPassword
        );

        isFormValid =
            isUsernameValid &&
            isEmailValid &&
            isPasswordValid &&
            isPasswordsMatch;
    }

    if (isFormValid) {
        alert("Registration Successful!");

        form.reset();

        document.querySelectorAll(".form-group").forEach((group) => {
            group.className = "form-group";
        });
    }
});

function checkRequired(inputs) {
    let valid = true;

    inputs.forEach((input) => {
        if (input.value.trim() === "") {
            showError(input, `${formatFieldName(input)} is required`);

            valid = false;
        } else {
            showSuccess(input);
        }
    });

    return valid;
}

function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(
            input,
            `${formatFieldName(input)} must be at least ${min} characters`
        );

        return false;
    }

    if (input.value.length > max) {
        showError(
            input,
            `${formatFieldName(input)} must be less than ${max + 1
            } characters`
        );

        return false;
    }

    showSuccess(input);

    return true;
}

function checkEmail(input) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regex.test(input.value.trim())) {
        showSuccess(input);

        return true;
    }

    showError(input, "Email is not valid");

    return false;
}

function checkPasswordsMatch(password1, password2) {
    if (password1.value !== password2.value) {
        showError(password2, "Passwords do not match");

        return false;
    }

    return true;
}

function showError(input, message) {
    const formGroup = input.parentElement;

    formGroup.className = "form-group error";

    formGroup.querySelector("small").innerText = message;
}

function showSuccess(input) {
    const formGroup = input.parentElement;

    formGroup.className = "form-group success";
}

function formatFieldName(input) {
    return (
        input.id.charAt(0).toUpperCase() +
        input.id.slice(1)
    );
}