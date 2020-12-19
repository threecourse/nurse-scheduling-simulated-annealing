import Annealer from './Annealer'
import GridState from './GridState'
import { Random } from './Utility'

let defaultParams = {
  n_trials: 100000,
  start_temp: 10,
  end_temp: 0.01,
  end_time: 100000,
  seed_runner: null,
  seed_annealer: null,
}

class GridStateManager {
  constructor(H, W, params = {}) {
    this.params = {
      ...defaultParams,
      params,
    }

    this.annealer = new Annealer(
      this.params.start_temp,
      this.params.end_temp,
      this.params.end_time,
      this.params.seed_annealer
    )
    this.random = new Random(this.params.seed_runner)

    this.prob_action1 = 0.4
    this.prob_action2 = 0.3
    this.n_nurses = H
    this.n_days = W
    this.n_trials = this.params.n_trials

    // state
    this.gridState = GridState.Create(this.n_nurses, this.n_days)
    this.steps = 0
    this.isRunning = false
    this.finished = false
  }

  // public methods
  reset() {
    if (this.isRunning) {
      return
    }
    this.gridState = GridState.Create(this.n_nurses, this.n_days)
    this.steps = 0
    this.isRunning = false
    this.finished = false
  }

  changeCell(r, c) {
    if (this.isRunning) {
      return
    }
    this.gridState.changeCell(r, c)
  }

  async runAsyncAll(steps, callback) {
    if (this.isRunning) {
      return
    }
    this.reset()
    this.isRunning = true
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await this.runAsync(steps).then(callback)
      if (this.finished) break
    }
    this.isRunning = false
  }

  // private methods
  runAsync(steps) {
    const self = this
    return new Promise(function (resolve) {
      // setTimeoutをつけないと、renderが走らないので注意
      setTimeout(() => {
        self.run(steps)
        return resolve(self)
      }, 1)
    })
  }

  run(steps) {
    for (let i = 0; i < steps; i++) {
      if (this.steps >= this.n_trials) {
        this.finished = true
        break
      }
      this.steps += 1
      if (i % 100 === 0) this.annealer.update(this.steps)
      let p = this.random.random()
      if (p < this.prob_action1) {
        let r = this.random.randint(this.n_nurses)
        let c = this.random.randint(this.n_days)
        let x = this.random.randint(3)
        let cx = this.gridState.matrix[r][c]
        if (x === cx) continue
        this.gridState.matrix[r][c] = x

        let current_score = this.gridState.current_score
        let next_score = this.gridState.evaluate()
        if (this.annealer.accept(current_score, next_score)) {
          this.gridState.current_score = next_score
        } else {
          this.gridState.matrix[r][c] = cx
        }
      } else if (p < this.prob_action1 + this.prob_action2) {
        let r1 = this.random.randint(this.n_nurses)
        let r2 = this.random.randint(this.n_nurses)
        let c = this.random.randint(this.n_days)
        let x1 = this.gridState.matrix[r1][c]
        let x2 = this.gridState.matrix[r2][c]
        if (x1 === x2) continue
        this.gridState.matrix[r1][c] = x2
        this.gridState.matrix[r2][c] = x1

        let current_score = this.gridState.current_score
        let next_score = this.gridState.evaluate()
        if (this.annealer.accept(current_score, next_score)) {
          this.gridState.current_score = next_score
        } else {
          this.gridState.matrix[r1][c] = x1
          this.gridState.matrix[r2][c] = x2
        }
      } else {
        let r = this.random.randint(this.n_nurses)
        let c1 = this.random.randint(this.n_days)
        let c2 = this.random.randint(this.n_days)
        let x1 = this.gridState.matrix[r][c1]
        let x2 = this.gridState.matrix[r][c2]
        if (x1 === x2) continue
        this.gridState.matrix[r][c1] = x2
        this.gridState.matrix[r][c2] = x1
        let current_score = this.gridState.current_score
        let next_score = this.gridState.evaluate()
        if (this.annealer.accept(current_score, next_score)) {
          this.gridState.current_score = next_score
        } else {
          this.gridState.matrix[r][c1] = x1
          this.gridState.matrix[r][c2] = x2
        }
      }
      if (this.gridState.current_score === 0) {
        this.finished = true
        break
      }
    }
    console.log(
      `steps: ${this.steps}, score: ${this.gridState.current_score}, finished ${this.finished} `
    )
  }
}

export default GridStateManager
