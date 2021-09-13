import tmi from 'tmi.js'
import dotenv from 'dotenv'
import eloVote from './eloVote.js'
dotenv.config()

const config = {
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_PASSWORD,
  },
  channels: ['filipo11'],
}

const client = new tmi.Client(config)

client.connect().catch(console.error)
client.on('message', (channel, tags, message, self) => {
  if (self) return

  const msg = message.toLocaleLowerCase()
  const words = msg.split(' ')
  const check = /^[0-9a-zA-Z\s\!]*$/i.test(msg)

  const isMod = tags.mod || channel.slice(1) === tags.username

  const voteCommand = words[0] === '!vote' || words[0] === '!v'
  if (voteCommand && eloVote.active && check) {
    const text = eloVote.voteValidation(words[1], tags.username)
    if (text) {
      client.say(channel, `@${tags.username} ${text}`)
    }
  }

  if (msg === '!votestart' && !eloVote.active && isMod) {
    eloVote.start()
    client.say(channel, 'wystartowano glosowanie wpisz !v <ranking>')
  }

  if (words[0] === '!voteend' && eloVote.active && isMod && check) {
    const users = eloVote.users
    const val = eloVote.end()
    if (isNaN(words[1])) {
      client.say(channel, `sredni wynik: ${val}`)
    } else {
      let text = ''
      const score = eloVote.calcScore(+val, +words[1])
      client.say(channel, `sredni wynik: ${val} | ${score}/5000`)
      users.sort((a, b) => b.number - a.number)
      users.forEach(e => {
        const score = eloVote.calcScore(e.number, +words[1])
        e.score = score
      })
      users.sort((a,b) => b.score - a.score)
    console.log(users)
    for(let i = 0; i < 3; i++){
      text += ` ${users[i].username} ${users[i].score}/5000,`
    }
        
      
      setTimeout(() => client.say(channel, `najlepszy wynik uzyskali:${text}`), 1000)

    }
  }
})

