Two-View Greeting App — Flet Workbench

A Python application built with Flet that demonstrates a two-view greeting experience, user input validation and route-based navigation. The repository also includes an interactive React-based workbench for exploring the application requirements and downloading the Python deliverable.

Project Overview

The Two-View Greeting App allows users to enter their name and receive a personalized greeting on a second screen.

The project demonstrates fundamental Python GUI development concepts, including event handling, state management, input validation and navigation.

Features

Python Flet Application

- Two application views: Home and Greeting.
- Name input using a text field.
- Personalized greeting using the entered name.
- Empty-input validation with an alert dialog.
- Navigation between application routes.
- Shared state between views.
- Asynchronous event handlers.
- Back navigation to the home screen.

Interactive Workbench

- Browser-based Flet application simulator.
- Interactive name input and greeting preview.
- Empty-name validation demonstration.
- Navigation simulation.
- Python source code display.
- Requirements checklist.
- Downloadable "main.py" deliverable.

Technology Stack

Technology| Purpose
Python| Main application logic
Flet| Python UI framework
React 19| Interactive workbench
TypeScript| Type-safe frontend logic
Vite| Frontend development and build tooling
Tailwind CSS| Interface styling

Project Structure

2-view-Greeting-fleet-app/
├── greeting_app/
│   ├── main.py
│   └── requirements.txt
├── src/
│   ├── components/
│   ├── data/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

Running the Python Application

Requirements

- Python 3.10 or later recommended.
- pip.
- Flet.

Installation

Navigate to the Python application directory:

cd greeting_app

Install dependencies:

pip install -r requirements.txt

Run the application:

python main.py

The application opens with a name-entry screen.

Running the Interactive Workbench

From the repository root:

Install dependencies:

npm install

Start the development server:

npm run dev

Build the frontend:

npm run build

Application Flow

1. The application opens on the home route "/".
2. The user enters their name.
3. If the name is empty, an alert dialog requests input.
4. If a valid name is provided, the application navigates to "/greeting".
5. The greeting screen displays "Hello, [Name]!".
6. The Back button returns the user to the home screen.

Core Python Concepts Demonstrated

- Functions and event handlers.
- Variables and shared state.
- Conditional statements.
- String manipulation and input validation.
- Asynchronous programming.
- UI components and event-driven programming.
- Route-based navigation.

Learning Outcomes

This project demonstrates practical experience with:

- Building graphical user interfaces using Python.
- Designing multi-view applications.
- Handling user input.
- Implementing validation and error feedback.
- Managing application state.
- Working with asynchronous events.
- Translating application requirements into code.

Future Improvements

- Add automated tests.
- Improve form validation and feedback.
- Add more greeting themes.
- Introduce persistent user preferences.
- Expand the application with additional views.

Author

Nokwazi Nobuhle Xaba

IT Student | Full-Stack Development | Technology Founder in Progress

GitHub: https://github.com/april07-pi

---

Created as a practical Python and Flet learning project.
