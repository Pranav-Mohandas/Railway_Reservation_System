# Railway_Reservation_System
A simple web-based Railway Reservation System for booking train tickets, managing passenger information, and viewing payment history.
Built using Node.js, Express.js, MySQL, and a basic HTML/CSS/JavaScript frontend.

## Project Aim
1. To develop a user-friendly online Railway Reservation System where users can:

2. View available trains and their details.

3. Book tickets by providing passenger details.

4. Handle different payment methods dynamically.

5. View past ticket history and payment records.

6. Maintain separate user profiles with secure login.

## Tools & Technologies Used
### Backend
Node.js: JavaScript runtime for server-side development.

Express.js: Web framework for creating REST APIs.

MySQL: Relational database for managing user, train, booking, and payment records.

### Frontend
HTML5: Markup language for creating the structure of web pages.

CSS3: Styling for enhancing the user interface.

JavaScript: Client-side scripting for interactivity and API integration.

### Other Tools
VS Code: Code editor.

MySQL Workbench: Database design and management.

Postman: API testing during development.

## Database Schema Overview
### Tables:
1. Profile
Stores user information like UserID, Name, Mobile Number, Email, and Password.

2. Passenger
Stores passenger details linked to a user.

3. Train
Stores train details like source, destination, and reservation type.

4. Payment
Stores payment records and types (UPI, Credit Card, etc.).

5. Ticket
Stores booked ticket details linked to payment and train.

## Core Features
1. User Authentication: Secure login/signup with unique email/mobile verification.

2. Train Listings: View trains, sources, destinations, reservation types.

3. Passenger Management: Auto-fetch or add new passenger info.

Dynamic Payment: Randomized payment amounts and payment type options.

Ticket Booking: Complete booking workflow linked with payments.

History Views: View past tickets and payment transactions.

