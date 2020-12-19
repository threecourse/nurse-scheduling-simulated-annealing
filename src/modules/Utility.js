import XorShift from 'xorshift'

export function getRandomSeed() {
  return Math.random() * Math.pow(2, 32)
}

export class Random {
  constructor(seed) {
    if (seed === null) seed = getRandomSeed()
    this.rand = new XorShift.constructor([seed, 1, 2, 3])
  }

  random() {
    return this.rand.random()
  }
  randint(end) {
    return Math.floor(this.rand.random() * end)
  }
}
