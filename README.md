TrapClick - A Client-Side Web Security Analyzer
A privacy-first tool for web security analysis built with vanilla JavaScript.

TrapClick is a web application that demonstrates a comprehensive understanding of client-side logic, UI/UX design, and core web technologies. It functions as a lightweight, in-browser tool for analyzing the security of a given URL. The project serves as an excellent example of building a full-featured, responsive application without relying on a backend server or external frameworks.

⚙️ Technical Stack
HTML5: The semantic foundation of the application's structure.

CSS3: Powers the entire visual presentation, from the responsive grid layout to the custom animations and the dual-theme system managed by CSS Variables.

JavaScript (ES6+): The core engine of the application. It handles all business logic, including the URL analysis algorithm, dynamic DOM updates, state management (theme, history), and event handling.

✨ Key Features
Custom Phishing Algorithm: A robust, pattern-based algorithm that inspects URLs for suspicious characteristics such as domain impersonation, keyword misuse, IP address masking, and TLD flags.

Dynamic UI with State Management: The application's UI updates in real-time based on the analysis results and user interactions, demonstrating effective DOM manipulation and a clear separation of concerns.

Light/Dark Theme: A seamlessly integrated theme toggle that persists the user's preference using localStorage.

Local History & Usage Tips: Stores the last 10 scan results locally in the browser's storage and provides a dedicated section for security best practices.

Performance & Privacy: All processing is done on the client side, ensuring no user data is transmitted or stored externally.

🚀 How to Run
Clone the Repository:

git clone [https://github.com/your-username/your-repository.git
cd your-repository](https://github.com/shashikiranmallela/phishing-url-detection.git)


Launch the App:
Simply open the index.html file in your browser. There is no build step or server required.

⚠️ Disclaimer
This tool is intended for educational and demonstration purposes. The analysis is based on a simplified pattern-matching algorithm and should not be used as a substitute for professional-grade security software or services.

🤝 Contributing
This project is a great starting point for anyone looking to contribute to open source. Feel free to open an issue or submit a pull request for:

Improving the analysis algorithm.

Adding new UI features or animations.

Refactoring code for better performance or readability.

📄 License
This project is open source and available under the MIT License.
