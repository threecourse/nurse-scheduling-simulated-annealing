const HD = 0 // 休日
const DS = 1 // 日勤
const NS = 2 // 夜勤

class GridState {
  constructor(height, width) {
    this.height = height
    this.width = width
    this.matrix = null
    this.current_score = 0.0
  }

  static Create(height, width) {
    let matrix = []
    for (let r = 0; r < height; r++) {
      let row = []
      for (let c = 0; c < width; c++) {
        row.push(0)
      }
      matrix.push(row)
    }
    return this.CreateWithArray(matrix)
  }

  static CreateWithArray(matrix) {
    let height = matrix.length
    let width = matrix[0].length
    let state = new GridState(height, width)
    state.matrix = matrix
    state.current_score = state.evaluate()
    return state
  }

  render() {
    // jsだと+=による連結で良いらしい
    let st = ''
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        st += this.matrix[r][c]
        if (c === this.width - 1) st += '\n'
        else st += ','
      }
    }
    return st
  }

  shift_matrix() {
    let matrix = []
    matrix.push(this.evaluation_amount_s1())
    matrix.push(this.evaluation_amount_s2())
    return matrix
  }

  nurse_matrix() {
    let matrix = []
    matrix.push(this.evaluation_amount_n1())
    matrix.push(this.evaluation_amount_n2())
    matrix.push(this.evaluation_amount_n3())
    matrix.push(this.evaluation_amount_n4())
    matrix.push(this.evaluation_amount_n5())
    return matrix
  }

  changeCell(r, c) {
    const v = this.matrix[r][c]
    this.matrix[r][c] = (v + 1) % 3
  }

  evaluate() {
    /*
        シフト制約
        条件1: 日勤のシフトが2人以上
        条件2: 夜勤のシフトが2人以上

        ナース制約
        条件1: 休みが7日以上
        条件2: 週末連休を1回以上確保する（6-7日目、13-14日目..を土日とする）
        条件3: 連続勤務は4日まで
        条件4: 夜勤の翌日の日勤は不可
        条件5: 連続夜勤は3日まで
     */
    const s1 = this.evaluation_amount_s1().reduce(
      (accm, curr) => accm + curr,
      0
    )
    const s2 = this.evaluation_amount_s2().reduce(
      (accm, curr) => accm + curr,
      0
    )
    const n1 = this.evaluation_amount_n1().reduce(
      (accm, curr) => accm + curr,
      0
    )
    const n2 = this.evaluation_amount_n2().reduce(
      (accm, curr) => accm + curr,
      0
    )
    const n3 = this.evaluation_amount_n3().reduce(
      (accm, curr) => accm + curr,
      0
    )
    const n4 = this.evaluation_amount_n4().reduce(
      (accm, curr) => accm + curr,
      0
    )
    const n5 = this.evaluation_amount_n5().reduce(
      (accm, curr) => accm + curr,
      0
    )
    return s1 + s2 + n1 + n2 + n3 + n4 + n5
  }

  evaluation_amount_s1() {
    let required_workers = 2
    return this.days_n_day_workers().map((value) =>
      Math.max(required_workers - value, 0)
    )
  }
  evaluation_amount_s2() {
    let required_workers = 2
    return this.days_n_night_workers().map((value) =>
      Math.max(required_workers - value, 0)
    )
  }
  evaluation_amount_n1() {
    let require_holidays = 7
    return this.workers_n_holidays().map((value) =>
      Math.max(require_holidays - value, 0)
    )
  }
  evaluation_amount_n2() {
    return this.workers_weekend_holidays()
  }
  evaluation_amount_n3() {
    return this.workers_serial_works()
  }
  evaluation_amount_n4() {
    return this.workers_day_after_night_work()
  }
  evaluation_amount_n5() {
    return this.workers_serial_night_works()
  }

  days_n_day_workers() {
    let day_values = []
    for (let c = 0; c < this.width; c++) {
      let workers = 0
      for (let r = 0; r < this.height; r++) {
        if (this.matrix[r][c] === DS) workers += 1
      }
      day_values.push(workers)
    }
    return day_values
  }

  days_n_night_workers() {
    let day_values = []
    for (let c = 0; c < this.width; c++) {
      let workers = 0
      for (let r = 0; r < this.height; r++) {
        if (this.matrix[r][c] === NS) workers += 1
      }
      day_values.push(workers)
    }
    return day_values
  }

  workers_n_holidays() {
    let worker_values = []
    for (let r = 0; r < this.height; r++) {
      let days = 0
      for (let c = 0; c < this.width; c++) {
        if (this.matrix[r][c] === HD) days += 1
      }
      worker_values.push(days)
    }
    return worker_values
  }

  workers_weekend_holidays() {
    // 土日に連続して休みをとれていない場合、カウントする
    // 土日（6-7日目、13-14日目..)を土日とする
    let worker_values = []
    let weekends = []
    for (let c = 6; c < this.width; c += 7) {
      weekends.push([c - 1, c])
    }

    for (let r = 0; r < this.height; r++) {
      let violation = 1
      weekends.forEach((weekend) => {
        let sat = weekend[0]
        let sun = weekend[1]
        if (this.matrix[r][sat] === HD && this.matrix[r][sun] === HD)
          violation = 0
      })
      worker_values.push(violation)
    }
    return worker_values
  }

  workers_serial_works() {
    // 連続の勤務のカウントを行う

    // 4連続を超える勤務日につき1カウントが増える
    // つまり、6連続勤務では2カウントとなる
    let worker_values = []
    let work_limit = 4

    for (let r = 0; r < this.height; r++) {
      let violation = 0
      let work_days = 0
      for (let c = 0; c < this.width; c++) {
        if (this.matrix[r][c] === HD) work_days = 0
        else {
          work_days += 1
          if (work_days > work_limit) violation += 1
        }
      }
      worker_values.push(violation)
    }
    return worker_values
  }

  workers_day_after_night_work() {
    let worker_values = []
    for (let r = 0; r < this.height; r++) {
      let violation = 0
      for (let c = 0; c < this.width; c++) {
        if (
          c < this.width - 1 &&
          this.matrix[r][c] === NS &&
          this.matrix[r][c + 1] === DS
        )
          violation += 1
      }
      worker_values.push(violation)
    }
    return worker_values
  }

  workers_serial_night_works() {
    // 3連続を超える勤務日につき1カウントが増える
    // つまり、6連続勤務では3カウントとなる

    let worker_values = []
    let work_limit = 3

    for (let r = 0; r < this.height; r++) {
      let violation = 0
      let work_days = 0
      for (let c = 0; c < this.width; c++) {
        if (this.matrix[r][c] !== NS) work_days = 0
        else {
          work_days += 1
          if (work_days > work_limit) violation += 1
        }
      }
      worker_values.push(violation)
    }
    return worker_values
  }
}

export default GridState
