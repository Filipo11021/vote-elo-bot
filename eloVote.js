const eloVote = {
  store: 0,
  count: 0,
  active: false,
  users: [],
  uniqueUsers: [],
  checkUnique(username) {
    const check = this.uniqueUsers.some((user) => user === username)
    return check
  },
  start() {
    this.active = true
  },
  reset() {
    this.store = 0
    this.count = 0
    this.active = false
    this.uniqueUsers = []
    this.users = []
  },
  end() {
    const score = this.store / this.count
    this.reset()
    return score
  },
  vote(username, number) {
    this.users.push({ username, number })
    this.uniqueUsers.push(username)
    this.store += number
    this.count++
   },
   calcScore(val, elo) {
      let x = Math.max(Math.min(val - elo, 1000), -1000);
      const score = Math.round(2500 * (Math.sin(x * Math.PI / 1000 + Math.PI / 2) + 1));
      return score
  },
  startValidation(isMod) {},
  endValidation(isMod) {},
  voteValidation(value, username) {
    const valueNum = +value
//this.checkUnique(username)
    if (2 ===3) {
      return 'juz glosowales'
    } else if (value < 0 || value >= 3200) {
      return 'nierealny ranking'
    } else if (isNaN(valueNum)) {
      return 'podaj liczbe'
    } else {
       eloVote.vote(username, valueNum)
      return 'zaglosowano'
    }
  },
}

export default eloVote
