// Created by Evgenii Mironichev, Copyright 2016,
// based on this awesome tutorial: https://mvalipour.github.io/node.js/2015/11/10/build-telegram-bot-nodejs-heroku/

var config = require('./config'); // rename config.js.example into config.js and set keys and tokens inside it

var Bot = require('node-telegram-bot-api');
var bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(config.TelegramToken);
  bot.setWebHook(config.TelegramProductionURL + bot.token);
}
else {
  bot = new Bot(config.TelegramToken, { polling: true });
}

//var Bot = require('node-telegram-bot-api'),
//    bot = new Bot(config.TelegramToken, { polling: true });

console.log('google_doc_reader_bot server started...');

// Make sure it is public or set to Anyone with link can view 
// "od6" is the fist worksheet in the spreadsheet
var url = "https://spreadsheets.google.com/feeds/list/" + config.googleSheetKey + "/od6/public/values?alt=json";

var moment = require('moment-timezone');

bot.onText(/(.+)$/, function (msg, match) {
    // keywords are anything typed in
  var keywords = match[1];
  var request = require("request");
      
    // send request to retrieve the spreadsheet as the JSON 
    request(url, function (error, response, body) {
        if (error || response.statusCode != 200) {
            console.log('Error: '+error); // Show the error
            console.log('Status code: ' + response.statusCode); // Show the error
            return;
        }
        
        var parsed = JSON.parse(body);
        var targetTime = -1;
        if (!isNaN(keywords))   // isNaN returns false if the value is number
        {
            try{
                targetTime = parseInt(keywords, 10);
            }
            catch(e){
                targetTime = -1;
            }
        }
        
        var formattedAnswer = "";
    
        var currentHours = parseInt(moment().tz(config.confTimeZone).format('HH'),10);
        var currentMinutes = parseInt(moment().tz(config.confTimeZone).format('mm'),10);
        // console.log("Current hours: " + currentHours);
        var currentAnswer = "";
        
        var itemsFound = 0;
        // sending answers
        parsed.feed.entry.forEach(function(item){
                // get the time(in hours) from the very first column
                var itemTime = parseInt(item.title.$t, 10);
                if (itemTime == targetTime){
                    // add the line break if not the first answer
                    if (itemsFound >0) formattedAnswer += "\n\n";
                    itemsFound++;
                    formattedAnswer += '\u27a1' + item.content.$t; // add item content, '\u27a1' is the arrow emoji
                }
                else if (currentHours == itemTime) // else collect items for the current hour
                {
                    if (currentAnswer != '')
                        currentAnswer += "\n\n"; 
                    currentAnswer += '\u27a1' + item.content.$t; // get item content, '\u27a1' is the arrow emoji
                }
                
                // else doing nothing
        });
        
        // if no items were found for the given time 
        if (itemsFound == 0)
        {
            if (targetTime<0 || targetTime>24)
                formattedAnswer = "Incorrect hours entered. Enter hours from 0 to 24 to get a list of talks at the given hour.\n\n";
            else 
                formattedAnswer = "No talks found for the given time ( " + targetTime+ " h)";
                
            // output current answer
            if (currentAnswer != '')
            {
                formattedAnswer += "Currently (" + currentHours + ":" + currentMinutes + ") we have these talks:\n";
                formattedAnswer += currentAnswer;
            }
        }
    
        // send message telegram finally
        bot.sendMessage(msg.chat.id, formattedAnswer).then(function () {
            // reply sent!
        });
    
    });

});

module.exports = bot;