











# Howto develop
(notes for myself so I will remember in 40 years)
* Write the frontend code you want in the frontend folder
* Write the backend code you need the backend folder, to send requests etc (cause CORS)
* Build the frontend code
* Copy the `dist` folder to the backend root folder and rename it to `frontend-build`
* Add `app.use(express.static('frontend-build'));` to the backend code
* Run the backend webserver and connect to it


