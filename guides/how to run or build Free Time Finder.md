# How to build and run Free Time Finder?

If you for any reason feel the need to build Free Time Finder yourself, you can do so by following the instructions below. If you do build and run the project yourself please keep it to your own local machine, if abused I will have to make this project private.

***
## Requirements
- Node.js & npm
  - You can find instructions on how to install Node.js and npm here: https://nodejs.org/en/download/
- pnpm
  - The easiest way to install pnpm is to run the following command in the terminal:
    ```bash
    npm install -g pnpm
    ```
- A code editor is suggested, I will use Visual Studio Code for this project

***

Now you can either build the project and then run it (from the built files), but I think it is easier just to run it directly from the source files or in "development" mode.

## Running Free Time Finder
- Git clone or download the project from github
- Open the project folder in your code editor
- You will need two terminal windows, one for the frontend client and one for the backend server. I Recommend Visual Studio Code and using the split terminal feature.

### Frontend:
- Run the following commands in one of the terminals:
  ```bash
  cd ./frontend
  ```
  ```bash
  pnpm i
  ```
  ```bash
  pnpm run dev
  ```
- This should display a message saying a dev server is running on your localhost (127.0.0.1). You can also run the following command in the terminal to see the dev server running on a different port (remove the '<' '>')
  ```bash
  pnpm run dev --port=<PORT>
  ```
- Click on the link to get to the dev server in the web browser.

### Backend:
- In the second terminal run the following commands:
  ```bash
  cd ./backend
  ```
  ```bash
  pnpm i
  ```
  ```bash
  pnpm run dev
  ```
- If you want you can make a .env file in the "src" folder of the backend project and put the following in it (remove the '<' '>')
  ```bash
  PORT=<PORT>
  ```	
  If you do this don't forget to port of the backend server in the vite.config.ts file! (in the frontend folder)

## Building Free Time Finder
- If you want to build Free Time finder do the same as you would if you wanted to run it but instead of
  ```bash
  pnpm run dev
  ```
  run
  ```bash
  pnpm run build
  ```
- Remember to set the api url correctly in the vite.prod.config.ts file! (in the frontend folder)