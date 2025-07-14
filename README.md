# Railway_Reservation_System
A simple web-based Railway Reservation System for booking train tickets, managing passenger information, and viewing payment history.
Built using Node.js, Express.js, MySQL, and a basic HTML/CSS/JavaScript frontend.

📌 Project Aim
To develop a user-friendly online Railway Reservation System where users can:

View available trains and their details.

Book tickets by providing passenger details.

Handle different payment methods dynamically.

View past ticket history and payment records.

Maintain separate user profiles with secure login.

🛠️ Tools & Technologies Used
Backend
Node.js: JavaScript runtime for server-side development.

Express.js: Web framework for creating REST APIs.

MySQL: Relational database for managing user, train, booking, and payment records.

Frontend
HTML5: Markup language for creating the structure of web pages.

CSS3: Styling for enhancing the user interface.

JavaScript: Client-side scripting for interactivity and API integration.

Other Tools
VS Code: Code editor.

MySQL Workbench: Database design and management.

Postman: API testing during development.

🗂️ Database Schema Overview
Tables:
Profile
Stores user information like UserID, Name, Mobile Number, Email, and Password.

Passenger
Stores passenger details linked to a user.

Train
Stores train details like source, destination, and reservation type.

Payment
Stores payment records and types (UPI, Credit Card, etc.).

Ticket
Stores booked ticket details linked to payment and train.

🚦 Core Features
User Authentication: Secure login/signup with unique email/mobile verification.

Train Listings: View trains, sources, destinations, reservation types.

Passenger Management: Auto-fetch or add new passenger info.

Dynamic Payment: Randomized payment amounts and payment type options.

Ticket Booking: Complete booking workflow linked with payments.

History Views: View past tickets and payment transactions.

