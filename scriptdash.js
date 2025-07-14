document.addEventListener("DOMContentLoaded", async function () {
    const userId = sessionStorage.getItem("userid");

    if (!userId) {
        alert("User not logged in! Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/profile/${userId}`);

        if (!response.ok) throw new Error("Failed to fetch profile");

        const profile = await response.json();

        document.getElementById("userid").textContent = profile.userid || "N/A";
        document.querySelectorAll("#username").forEach(el => el.textContent = profile.username || "N/A");
        document.getElementById("Mobile_number").textContent = profile.Mobile_number || "N/A";
        document.getElementById("email").textContent = profile.email || "N/A";

        document.getElementById("profileSection").classList.remove("hidden");

    } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error loading profile. Please log in again.");
        sessionStorage.removeItem("userid");
        window.location.href = "login.html";
    }
});

// ✅ Logout function
document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.removeItem("userid");
    alert("Logged out successfully!");
    window.location.href = "login.html";
});

// ✅ Utility function to toggle sections
function showSection(sectionId) {
    document.querySelectorAll("main section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

// ✅ Nav Event Handlers
document.getElementById("profileBtn").addEventListener("click", () => showSection("profileSection"));
document.getElementById("bookTicketsBtn").addEventListener("click", () => showSection("bookingSection"));
document.getElementById("pastTicketsBtn").addEventListener("click", () => {
    showSection("pastTicketsSection");
    fetchPastTickets();
});
document.getElementById("paymentHistoryBtn").addEventListener("click", () => {
    showSection("paymentHistorySection");
    fetchPaymentHistory();
});

// ✅ Fetch Past Tickets
async function fetchPastTickets() {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
        alert("User not logged in!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/past_tickets/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch past tickets");

        const tickets = await response.json();
        const tableBody = document.getElementById("pastTicketsTable");
        tableBody.innerHTML = "";

        tickets.forEach(ticket => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${ticket.ticket_id}</td>
                <td>${ticket.transaction_id}</td>
                <td>${ticket.train_no}</td>
                <td>${ticket.train_name}</td>
                <td>${ticket.reservation_type}</td>
                <td>${ticket._Source}</td>
                <td>${ticket.destination}</td>
                <td>${ticket.booking_status}</td>
                <td>${ticket.booking_datetime}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching past tickets:", error);
        alert("Error loading past tickets.");
    }
}

// ✅ Fetch Payment History
async function fetchPaymentHistory() {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
        alert("User not logged in!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/payment_history/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch payment history");

        const payments = await response.json();
        const tableBody = document.getElementById("paymentHistoryTable");
        tableBody.innerHTML = "";

        payments.forEach(payment => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${payment.transaction_id}</td>
                <td>${payment.payment_Type}</td>
                <td>${payment.amount}</td>
                <td>${payment.confirmation}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching payment history:", error);
        alert("Error loading payment history.");
    }
}
const userid = localStorage.getItem("userid");

// Autofill user profile
async function fetchUserProfile() {
    const res = await fetch(`http://localhost:5000/profile/${userid}`);
    const data = await res.json();
    document.getElementById("name").value = data.username;
    document.getElementById("mobile_number").value = data.Mobile_number;
}

// Populate train list


// Populate Train Dropdown and Auto-fill Details
async function loadTrainList() {
    try {
        const response = await fetch("http://localhost:5000/trains");
        const trains = await response.json();

        const trainSelect = document.getElementById("train_no");
        trainSelect.innerHTML = `<option value="">Select Train</option>`;

        trains.forEach(train => {
            const option = document.createElement("option");
            option.value = train.train_no;
            option.textContent = `${train.train_no} - ${train.train_name}`;
            option.dataset.name = train.train_name;
            option.dataset.source = train.source;
            option.dataset.destination = train.destination;
            option.dataset.reservation_type = train.reservation_type;
            trainSelect.appendChild(option);
        });

        trainSelect.addEventListener("change", function () {
            const selected = trainSelect.options[trainSelect.selectedIndex];
            document.getElementById("trainName").textContent = selected.dataset.name || "--";
            document.getElementById("source").textContent = selected.dataset.source || "--";
            document.getElementById("destination").textContent = selected.dataset.destination || "--";
            document.getElementById("reservation_type").textContent = selected.dataset.reservation_type || "--";
        });

    } catch (error) {
        console.error("Error loading trains:", error);
    }
}

document.getElementById("bookTicketsBtn").addEventListener("click", async () => {
    showSection("bookingSection");
    await loadTrainList();
    
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        // Check passenger status
        const response = await fetch(`http://localhost:5000/passenger_status/${userId}`);
        if (!response.ok) throw new Error("Failed to check passenger status");
        
        const { exists, passenger } = await response.json();
        
        if (exists) {
            // Existing passenger - auto-fill all details
            document.getElementById("name").value = passenger.name;
            document.getElementById("mobile_number").value = passenger.mobile_number;
            document.getElementById("aadhar").value = passenger.aadhar;
            document.getElementById("age").value = passenger.age;
            document.getElementById("gender").value = passenger.gender;

            
            // Disable fields that are auto-filled
            ['name', 'mobile_number', 'aadhar', 'age', 'gender'].forEach(id => {
                document.getElementById(id).disabled = true;
            });
        } else {
            // New passenger - auto-fill from profile
            const profileRes = await fetch(`http://localhost:5000/profile/${userId}`);
            if (!profileRes.ok) throw new Error("Failed to fetch profile");
            
            const profile = await profileRes.json();
            document.getElementById("name").value = profile.username || "";
            document.getElementById("mobile_number").value = profile.Mobile_number || "";
            
            // Enable remaining fields
            ['aadhar', 'age', 'gender'].forEach(id => {
                document.getElementById(id).disabled = false;
                document.getElementById(id).required = true;
            });
        }
    } catch (error) {
        console.error("Error checking passenger status:", error);
        alert("Error loading booking form");
    }
});

// Booking Form Submit Handler
document.getElementById("bookingForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = sessionStorage.getItem("userid");
    const payload = {
        userid: userId,
        name: document.getElementById("name").value,
        mobile_number: document.getElementById("mobile_number").value,
        aadhar: document.getElementById("aadhar").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,

        train_no: document.getElementById("train_no").value,
    };
    

    try {
        const response = await fetch("http://localhost:5000/book_ticket", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
            alert(`✅ Ticket booked successfully!\n🎟 Ticket ID: ${data.ticket_id}\n💳 Transaction ID: ${data.transaction_id}\n💰 Amount: ₹${data.amount}`);
        
            document.getElementById("bookingForm").reset();
            document.getElementById("trainName").textContent = "--";
            document.getElementById("source").textContent = "--";
            document.getElementById("destination").textContent = "--";
            document.getElementById("reservation_type").textContent = "--";
        }
        
    } catch (err) {
        console.error("Booking failed:", err);
        alert("Booking failed. Please try again.");
    }
});


  