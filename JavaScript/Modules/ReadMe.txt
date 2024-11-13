This overview assumed a Unix-like system like GNU/Linux (which includes 'Raspberry Pi OS').

Setting Up:
- Install Node.js: If you haven't already, download and install Node.js from the official website https://nodejs.org/en.
- Create a project directory: Open a terminal and navigate to the directory using the cd command.
- Initialize Node.js project: Run 'npm init -y' in your terminal to create a basic 'package.json' file for your project.
- Install Express: Using the terminal, run the following command to install Express: 'npm install express'.

Creating the Server:
- In your project directory, create a file named 'server.js'.
- Write the server code and add it to the 'server.js' file.

Create the HTML file:
- Create a new folder named 'public' in your project directory if it doesn't exist.
- Create your HTML file inside the public folder (e.g., index.html).

Run the Server:
- Run: 'node server.js' in your terminal.

Accessing the Server:
- HTML file:
    Open your web browser and navigate to 'http://localhost:3000/'. 
    This should now load your HTML file from the public directory.
- Fetch request:
    You can use the Fetch API in your browser or any other tool to make a GET request to 'http://localhost:3000/data'
    This will trigger the route handler and return the message "Hello from the Node.js server!".

<ADD CODE HERE>

This server code combines two functionalities, allowing you to respond to fetch get-request and serve the static HTML file at the same time.

Directory structure:
  ──NodeServer/              <- The project directory.
    ├── server.js
    ├── node_modules/        <- Directory created by 'npm install express' command.
    ├── package.json         <- File created by 'npm init -y' command.
    ├── package-lock.json    <- File created by 'npm install express' command.
    ├── public/
    │   ├── main.css
    │   └── main.js
    ├── views/
    │   └── index.html
    └── ReadMe.txt           <- This is this file.

Explanation:
- This code imports the 'http' module from Node.js, which allows you to create a server.
- It defines the 'hostname' and 'port' for the server. You can change the port to any available port number (avoid using common ports like 80 or 443).
- The 'createServer()' function creates a new HTTP server that listens for incoming requests.
- The function passed to createServer is called for each incoming request.
- The 'server.listen()' function starts the server and listens for connections on the specified hostname and port. It also logs a message to the console when the server is started.
- The use of Middleware:
  - We added a middleware function using 'app.use()'. This function checks if the request path starts with a slash '/'.
  - If the path start with a slash (likely a browser request for the HTML file), the middleware serves static files using 'express.static()'. 
  - If the path doesn't start with a slash the middleware simply calls 'next()', allowing the request to proceed through the remaining routes.
  - If the path start with '/data', this will trigger the route handler and return to the client the message "Hello from the Node.js server!" with status code 200(OK) and set the content type header to 'text/plain'.

Using 'nodemon' for development:
  - If you're in a development environment, using nodemon can be a great solution. It watches for file changes and restarts the server automatically.
  - Install nodemon: Run: 'npm install --save-dev nodemon'.
  - Then, start the server by running: 'nodemon server.js' instead of 'node server.js'.
