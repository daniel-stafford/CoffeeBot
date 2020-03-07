function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function getLuckyPeople(){
  // Get the list of our office coffee drinkers from google sheets
  const coffeeDrinkers = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('people').getDataRange().getValues();

  // Randomly shuffle the coffee drinkers array and extract the first two names
  const shuffledArray = shuffle(coffeeDrinkers)
  const luckyWinners = shuffledArray.slice(0,3)
  return luckyWinners
}

function getMessage(){
  const [winnerOne, winnerTwo, winnerThree] = getLuckyPeople()

  // Create CoffeeBot's dialogue
  return`@channel Well hello there, FT3! Rumor has it that you missed me!

  I was on brief Robot vacation - a week in Thailand with the Boston Dynamics dog - but am now back to serve you.

  Since you have received your very own coffee machine, I hear coffee consumption has increased dramatically!

  To keep everyone sufficiently caffeinated, I am now randomly assigning three people per day and am using a new and improved randomization algorithm called the Fisher-Yates (aka Knuth) shuffle.

  Beep bop boop!  I have selected the following humans:

  @${winnerOne} will make us coffee this morning.

  @${winnerTwo} will make another pot around lunch.

  @${winnerThree} will make us mid-afternoon coffee.

  Bop Boop Beep! Have a nice day.`
  }

// CoffeeBot is set to trigger once per day between 0800-0900.
function sendMessage(){
  const today = new Date()
  // Don't trigger on the weekend
  //if (today.getDay()===6 || today.getDay()===0) return Logger.log("CoffeeBot doesn't work on the weekends!")

  // Post message on slack channel
  const slackWebhookURL = 'https://hooks.slack.com/services/<INSERYOURIDHERE>'
  const payload = {
    'link_names': 1
  }
  const opts = {
    'method': 'post',
    'contentType': 'application/json'
  }
  payload.text = getMessage()
  Logger.log(payload.text)
  opts.payload = JSON.stringify(payload)
  UrlFetchApp.fetch(slackWebhookURL, opts)
}
