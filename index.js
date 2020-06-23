const TelegramBot = require('node-telegram-bot-api')
const token = '1164102191:AAHUSUVpZQGFbbLjd6I9VTghUGCrRCzHknI'
const bot = new TelegramBot(token, { polling: true })

let initGame = false

let options = []
let playingUsers = []
let chosenUsers = []
let chatId = undefined

const keyboard = [
  [
    {
      text: 'Камень',
      callback_data: 'камень 🌚',
    },
  ],
  [
    {
      text: 'Ножницы',
      callback_data: 'ножницы ✂️',
    },
  ],
  [
    {
      text: 'Бумага',
      callback_data: 'бумага 📜',
    },
  ],
]

bot.onText(/start/, (msg) => {
  if (initGame === false) {
    initGame = true
    chatId = msg.chat.id

    bot.sendMessage(chatId, 'запускаю игру камень 🌚 ножницы ✂️ бумага 📜')
    bot.sendMessage(chatId, 'напиши, что ты в игре командой "/играю"')
  }
})

bot.onText(/играю/, (msg) => {
  if (initGame === true) {
    const userId = msg.from.id

    if (playingUsers.includes(userId)) {
      bot.sendMessage(chatId, 'ты уже сделал свой выбор')
      return
    }

    bot.sendMessage(userId, `сделай выбор`, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    })
  }
})

bot.on('callback_query', (query) => {
  const userId = query.from.id
  if (chosenUsers.includes(userId)) {
    return
  }
  chosenUsers.push(userId)

  const username = query.from.first_name
  const data = query.data
  const choice = {
    user: username,
    choice: data,
    text: `${username} выбрал ${data}`,
  }

  bot.sendMessage(userId, `отлично, ты выбрал ${data}`)
  bot.sendMessage(chatId, `${username} сделал выбор`)

  options.push(choice)
})

setInterval(() => {
  if (chosenUsers.length >= 2) {
    bot.sendMessage(chatId, 'отлично, все сдеали свой выбор!')
    bot.sendMessage(chatId, '-------------------------------')
    options.forEach((option) => {
      bot.sendMessage(chatId, option.text)
    })

    stopGame()
  }
}, 1000)

bot.onText(/stop/, () => {
  stopGame()
})

bot.onText(/обнули/, (msg) => {
  chatId = msg.chat.id
  bot.sendMessage(chatId, 'обнулил игру')
  stopGame()
})

function stopGame() {
  options = []
  playingUsers = []
  initGame = false
  chosenUsers = []
}
