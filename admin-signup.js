// Photo upload logic
const avatarInput = document.getElementById("avatarInput");
const photoBtn = document.getElementById("photoBtn");
const plusBtn = document.getElementById("plusBtn");

photoBtn.addEventListener("click", () => avatarInput.click());
plusBtn.addEventListener("click", () => avatarInput.click());

avatarInput.addEventListener("change", () => {
    if (avatarInput.files.length > 0) {
        photoBtn.textContent = avatarInput.files[0].name;
    }
});

document.getElementById("adminForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let username = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let admin_id = document.getElementById("admin_id").value;
    let phone = document.getElementById("phone").value;
    let department = document.getElementById("department").value;
    let avatarFile = avatarInput.files[0];

    let message = document.getElementById("message");

    // Constraints
    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!username || !email || !password || !admin_id || !phone || !department) {
        message.style.color = "red";
        message.innerText = "Please fill all fields!";
        return;
    }

    if (!nameRegex.test(username)) {
        message.style.color = "red";
        message.innerText = "Name should only contain letters!";
        return;
    }

    if (!phoneRegex.test(phone)) {
        message.style.color = "red";
        message.innerText = "Phone number should be exactly 10 digits!";
        return;
    }

    if (!avatarFile) {
        message.style.color = "red";
        message.innerText = "Please upload a photo!";
        return;
    }

    try {
        message.style.color = "blue";
        message.innerText = "Signing up...";

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("id", admin_id);
        formData.append("department", department);
        formData.append("avatar", avatarFile);

        let response = await fetch("https://web-wizards-backend.onrender.com/auth/signup/admin", {
            method: "POST",
            body: formData
        });

        let data = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.innerText = data.message || "Admin registered successfully!";
            alert("Admin registration successful! Redirecting to login...");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            console.error("Signup failed:", data);
            message.style.color = "red";
            const errMsg = (data.detail && Array.isArray(data.detail))
                ? data.detail.map(err => err.msg).join(", ")
                : (data.detail || data.message || "Signup failed (Username might be taken)");
            message.innerText = errMsg;
        }

    } catch (error) {
        message.style.color = "red";
        message.innerText = "Server error!";
        console.error(error);
    }
});
