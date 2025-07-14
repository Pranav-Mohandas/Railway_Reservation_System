document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const userid = document.getElementById("userid").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const Mobile_number = document.getElementById("Mobile_number").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid, username, email, Mobile_number, password }),
        });

        let result;
        try {
            result = await response.json();  // Try parsing JSON
        } catch {
            throw new Error(await response.text()); // If JSON fails, use plain text
        }

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert("Signup successful! Please login.");
        window.location.href = "login.html";
    } 
    catch (error) {
        alert("Signup failed: " + error.message);
    }
});
