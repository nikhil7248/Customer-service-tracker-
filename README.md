# 🛠️ Issue Tracker Frontend

A lightweight, browser-based issue tracking system built using vanilla JavaScript, HTML, and CSS. It allows users to create, view, update, and filter issues with comments — all within a dynamic and responsive interface.

---

## ✨ Features

- 📋 **View All Issues**: Display a table of issues with ID, title, customer, status, priority, and creation date.
- 🔍 **Filter and Search**:
  - Filter by status (open, in-progress, resolved)
  - Filter by priority (low, medium, high, urgent)
  - Live keyword search across issue titles, customers, descriptions, and IDs
- ➕ **Add New Issue**: Create new issues through a form with fields like title, customer, email, priority, and description.
- 🧾 **Issue Detail View**:
  - View complete details and comments of an issue in a modal
  - Update issue status
  - Add internal comments
- 📊 **Dashboard Stats**: Overview of total open, in-progress, resolved, and urgent issues.
- 🛡️ **Simple Authentication Placeholder**: Includes a logout button (non-functional in demo).

---

## 🧰 Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- No frameworks or libraries — fully vanilla JS
- Data is managed client-side using in-memory JavaScript arrays

---

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/issue-tracker-frontend.git
2. Navigate to the project directory:
cd issue-tracker-frontend


3. Open index.html in your browser:
open index.html








📁 Project Structure

├── index.html          # Main HTML file
├── style.css           # Basic styling for layout and UI
└── script.js           # Core JavaScript logic for functionality
