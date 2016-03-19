# google_sheet_reader_bot
Telegram bot to get data from Google Sheet, checks the very first column for time (in hours) and returns rows where time matches

## steps to use

### 1. Create Google Sheet
| Event Start Hour  | Where      | Event Description |
| ------- | ---------------- | ---------------- |
| 9  | red room | first talk description |
| 10 | red room | talk about javascript |
| 11 | red room  | some marketing talk bs |
| 9  | green room | some keynote talk |
| 10 | green room | networking and coffee |
| 11 | green room  | some use case for node.js |

#### 2. Make this Google sheet as public or vieweable to anyone
#### 3. Create a new app on heroku (say, "myapp-bot-app")
#### 4. Register telegram bot (send **/newbot** commmand to register bot with [https://telegram.me/BotFather](@BotFather) in Telegram) and get its APIKEY.
#### 5. Copy `config.js.example` into `config.js`
#### 6. Fill values in `config.js` to set:

    module.exports = {
     'TelegramProductionURL': 'https://myapp-bot-app.herokuapp.com/', // your heroku app do not forget trailing "/" !!
     'TelegramToken': '<telegram token here>', // Telegram token you got from @BotFather
     'googleSheetKey': '<google sheet key>', // the key of the google sheet (should be public!), extract key from the google sheet doc publich url
     "confTimeZone": "Europe/Berlin" // time zone of the conference so the bot could output events for the current time in the form like "Europe/Berlin", see http://momentjs.com/timezone/
    }
#### 7. Push the code to heroku
#### Congrats! Now you may send the command like `10` to the bot and it will send you all events which are taking place at 10 hours according to the spreadsheet.
You may change the spreadsheet and the bot will take new data form the spreadheet online.
