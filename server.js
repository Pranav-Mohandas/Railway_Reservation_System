const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, "public")));

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "your_username",
    password: "your_password",
    database: "mini_project"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database");
});

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));

// Signup
app.post("/signup", (req, res) => {
    const { userid, username, email, Mobile_number, password } = req.body;

    if (!userid || !username || !email || !Mobile_number || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const checkUserSql = "SELECT * FROM profile WHERE userid = ? OR email = ? OR Mobile_number = ?";
    db.query(checkUserSql, [userid, email, Mobile_number], (err, existing) => {
        if (err) {
            console.error("User check error:", err);
            return res.status(500).json({ message: "Server error during user check" });
        }

        if (existing.length > 0) {
            return res.status(409).json({ message: "User already exists with same ID, email, or mobile number" });
        }

        const sql = "INSERT INTO profile (userid, username, email, Mobile_number, password) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [userid, username, email, Mobile_number, password], (err) => {
            if (err) {
                console.error("Signup Error:", err);
                return res.status(500).json({ message: "Signup failed due to a server error" });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    });
});

// Login
app.post("/login", (req, res) => {
    const { userid, password } = req.body;

    if (!userid || !password) {
        return res.status(400).json({ message: "User ID and password are required" });
    }

    const sql = "SELECT * FROM profile WHERE userid = ?";
    db.query(sql, [userid], (err, result) => {
        if (err) return res.status(500).json({ message: "Internal Server Error" });
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result[0];

        if (password !== user.password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        res.status(200).json({ message: "Login successful", userid: user.userid });
    });
});

// Fetch profile
app.get("/profile/:userid", (req, res) => {
    const userid = req.params.userid;
    const sql = "SELECT userid, username, Mobile_number, email FROM Profile WHERE userid = ?";
    db.query(sql, [userid], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        if (!result || result.length === 0) return res.status(404).json({ error: "Profile not found" });

        res.json(result[0]);
    });
});

// Fetch trains
app.get("/trains", (req, res) => {
    const sql = "SELECT * FROM TRAIN";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Internal Server Error" });
        res.json(result);
    });
});

// Passenger Status
app.get("/passenger_status/:userid", (req, res) => {
    const userid = req.params.userid;
    const sql = "SELECT * FROM Passenger WHERE userid = ?";
    db.query(sql, [userid], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        res.json({ exists: result.length > 0, passenger: result[0] });
    });
});

// Book Ticket
app.post("/book_ticket", async (req, res) => {
    const {
        userid,
        name,
        age,
        gender,
        mobile_number,
        aadhar,
        train_no
    } = req.body;

    if (!userid || !name || !age || !gender || !mobile_number || !aadhar || !train_no) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Get additional train details
    const trainQuery = "SELECT train_name, reservation_type, source, destination FROM train WHERE train_no = ?";
    db.query(trainQuery, [train_no], (err, trainResult) => {
        if (err || trainResult.length === 0) {
            console.error("🚨 Train lookup failed:", err?.sqlMessage || "No train found");
            return res.status(500).json({ message: "Invalid train number" });
        }

        const { train_name, reservation_type, source, destination } = trainResult[0];

        // 1. Check if passenger exists, else insert
        const checkPassengerQuery = "SELECT * FROM passenger WHERE userid = ?";
        db.query(checkPassengerQuery, [userid], (err, passengerResult) => {
            if (err) {
                console.error("🔍 Passenger check failed:", err.sqlMessage);
                return res.status(500).json({ message: "Error checking passenger" });
            }

            if (passengerResult.length === 0) {
                const insertPassengerQuery = `
                    INSERT INTO passenger (userid, name, mobile_number, aadhar, age, gender)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                db.query(insertPassengerQuery, [userid, name, mobile_number, aadhar, age, gender], (err) => {
                    if (err) {
                        console.error("➕ Passenger insert failed:", err.sqlMessage);
                        return res.status(500).json({ message: "Failed to add passenger" });
                    }
                    console.log("✅ Passenger inserted.");
                });
            }

            // 2. Insert payment first
            const amount = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
            const insertPaymentQuery = `
                INSERT INTO payment (payment_Type, amount, confirmation)
                VALUES ('UPI', ?, 'Confirmed')
            `;
            db.query(insertPaymentQuery, [amount], (err, paymentResult) => {
                if (err) {
                    console.error("💳 Payment insert failed:", err.sqlMessage);
                    return res.status(500).json({ message: "Payment processing failed" });
                }

                const transaction_id = paymentResult.insertId;
                console.log("💰 Payment successful. Transaction ID:", transaction_id);

                // 3. Now insert into ticket with the generated transaction_id
                const insertTicketQuery = `
                    INSERT INTO ticket 
                    (transaction_id, name, age, train_no, train_name, reservation_type, _source, destination, booking_status, booking_datetime, mobilenumber)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', NOW(), ?)
                `;
                db.query(insertTicketQuery, [
                    transaction_id,
                    name,
                    age,
                    train_no,
                    train_name,
                    reservation_type,
                    source,
                    destination,
                    mobile_number
                ], (err, ticketResult) => {
                    if (err) {
                        console.error("🎫 Ticket insert failed:", err.sqlMessage);
                        return res.status(500).json({ message: "Ticket booking failed" });
                    }

                    const ticket_id = ticketResult.insertId;
                    return res.status(201).json({
                        message: "✅ Ticket booked successfully",
                        ticket_id,
                        transaction_id,
                        amount
                    });
                });
            });
        });
    });
});


// Past Tickets
app.get("/past_tickets/:userid", (req, res) => {
    const userid = req.params.userid;
    const sql = `
        SELECT ticket_id, transaction_id, train_no, train_name, reservation_type, _Source, destination, booking_status, booking_datetime 
        FROM ticket 
        WHERE mobilenumber IN (SELECT Mobile_number FROM profile WHERE userid = ?)
    `;
    db.query(sql, [userid], (err, result) => {
        if (err) return res.status(500).json({ message: "Internal Server Error" });
        if (!result || result.length === 0) return res.status(404).json({ message: "No past tickets found" });
        res.json(result);
    });
});

// Payment History
app.get("/payment_history/:userid", (req, res) => {
    const userid = req.params.userid;
    const sql = `
        SELECT p.transaction_id, p.payment_Type, p.amount, p.confirmation
        FROM payment p
        JOIN ticket t ON p.transaction_id = t.transaction_id
        WHERE t.mobilenumber IN (
            SELECT Mobile_number FROM profile WHERE userid = ?
        )
    `;
    db.query(sql, [userid], (err, result) => {
        if (err) return res.status(500).json({ message: "Error fetching payment history" });
        if (!result || result.length === 0) return res.status(404).json({ message: "No payment history found" });
        res.json(result);
    });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
