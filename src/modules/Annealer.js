import XorShift from 'xorshift'
import { getRandomSeed } from './Utility'

class Annealer {
  constructor(start_temp, end_temp, end_time, seed = null) {
    if (seed === null) seed = getRandomSeed()
    this.start_temperature = start_temp
    this.end_temperature = end_temp
    this.end_time = end_time
    this.temperature = this.start_temperature
    this.rand = new XorShift.constructor([seed, 1, 2, 3])
  }

  update(time) {
    // end_tempertureが小さすぎると、序盤の温度が低くなりすぎるので注意が必要
    let elapsed = Math.max(Math.min(time / this.end_time, 1.0), 0.0)
    this.temperature =
      Math.pow(this.start_temperature, 1.0 - elapsed) *
      Math.pow(this.end_temperature, elapsed)
  }

  accept(score_current, score_next, is_minimize = true) {
    let prob = this.accept_prob(score_current, score_next, is_minimize)
    return prob >= 1.0 || this.rand.random() < prob
  }

  accept_prob(score_current, score_next, is_minimize = true) {
    let gain = score_next - score_current
    if (is_minimize) gain *= -1.0

    if (gain > 0.0) return 1.0
    const eps = 0.001
    const prob = Math.exp(gain / (this.temperature + eps))
    return prob
  }
}

export default Annealer
