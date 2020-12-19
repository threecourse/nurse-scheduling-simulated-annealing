import GridStateManager from '../modules/GridStateManager'

// eslint-disable-next-line no-undef
it('run', () => {
  let params = {
    n_trials: 100000,
    n_nurses: 8,
    n_days: 14,
    start_temp: 10,
    end_temp: 0.01,
    end_time: 100000,
    seed_runner: null,
    seed_annealer: null,
  }
  let manager = new GridStateManager(params.n_nurses, params.n_days, params)
  manager.run(params.n_trials)
  console.log(manager.gridState.render())
})
