function getLuckyPeople(){
  //get the list of our office coffee drinkers from google sheets
  const coffeeDrinkers = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('people').getDataRange().getValues();
  //randomly shuffle the coffee drinkers array and extract the first two names
  const luckyWinners = coffeeDrinkers
  .map((a) => ({sort: Math.random(), value: a}))
  .sort((a, b) => a.sort - b.sort)
  .map((a) => a.value)
  .slice(0,2)
  return luckyWinners
}

function getMessage(){
  const [winnerOne, winnerTwo] = getLuckyPeople()
  //create CoffeeBot's dialogue
  const message = `@channel Hyvää huomenta! As your CoffeBot overlord, I have randomly selected ${winnerOne}to take care of our coffee this morning. ${winnerTwo} will make another pot in the afternoon. Beep bop boop. Have a nice day!`
  return message
}

//this function is set to trigger once per day between 0800-0900.
function sendMessage(){
  //don't trigger on the weekend
  const day = new Date()
  if (day.getDay()===6 || day.getDay()===0) return Logger.log("CoffeeBot doesn't work on the weekends!")
  //post message on slack channel
  const slackWebhookURL = 'https://hooks.slack.com/services/INSERTYOURIDHERE'
  const payload = {
    'link_names': 1
  }
  const opts = {
    'method': 'post',
    'contentType': 'application/json'
  }
  payload.text = getMessage()
  Logger.log("text", payload.text)
  opts.payload = JSON.stringify(payload)
  UrlFetchApp.fetch(slackWebhookURL, opts)
}
