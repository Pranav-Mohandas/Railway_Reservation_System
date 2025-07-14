document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const userid = document.getElementById("userid").value;
    const password = document.getElementById("password").value;

    if (!userid || !password) {
        alert("User ID and password are required.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // ✅ Store actual user ID returned by the server
        sessionStorage.setItem("userid", data.userid);
        sessionStorage.setItem("username", data.username); // for UI display

        alert("Login successful!");
        window.location.href = "dashboard.html";  // Redirect to dashboard

    } catch (error) {
        console.error("Login error:", error);
        alert(error.message);
    }
});
