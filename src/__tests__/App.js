/* eslint-disable no-unused-vars,no-undef */
import { render, screen } from '@testing-library/react'
import App from '../App'
import GridState from '../modules/GridState'
import Annealer from '../modules/Annealer'

// eslint-disable-next-line no-undef
test('simple calculation', () => {
  // eslint-disable-next-line react/react-in-jsx-scope
  const x = 2
  const y = 2
  // eslint-disable-next-line no-undef
  expect(x + y).toBe(4)
})

const ary_s1 = [
  [0, 0, 0, 1, 1],
  [1, 0, 0, 1, 1],
  [0, 1, 2, 1, 1],
  [2, 1, 2, 1, 0],
]

const ary_s2 = [
  [0, 0, 0, 2, 2],
  [1, 0, 0, 2, 2],
  [0, 1, 2, 2, 2],
  [2, 1, 2, 2, 0],
]
const ary_n1 = [
  [0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 2, 0, 0, 0, 0],
  [2, 1, 2, 0, 0, 0, 0, 0],
]
const ary_n2 = [
  [2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],
  [2, 1, 2, 1, 2, 0, 0, 2, 1, 2, 1, 2, 1, 2],
  [2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 0, 0],
  [2, 1, 2, 1, 2, 0, 0, 2, 1, 2, 1, 2, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0],
]
const ary_n3 = [
  [0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 2, 1, 2, 2, 0, 0, 0, 0, 0, 0],
]
const ary_n4 = [
  [0, 1, 2, 0, 2, 0, 1, 0],
  [1, 2, 1, 2, 1, 2, 1, 2],
  [2, 1, 2, 1, 2, 1, 2, 1],
]
const ary_n5 = [
  [1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1],
  [0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0],
]

test('state s1', () => {
  let state = GridState.CreateWithArray(ary_s1)
  expect(state.evaluation_amount_s1()).toStrictEqual([1, 0, 2, 0, 0])
})

test('state s2', () => {
  let state = GridState.CreateWithArray(ary_s2)
  expect(state.evaluation_amount_s2()).toStrictEqual([1, 2, 0, 0, 0])
})

test('state n1', () => {
  let state = GridState.CreateWithArray(ary_n1)
  expect(state.evaluation_amount_n1()).toStrictEqual([0, 0, 1, 2])
})

test('state n2', () => {
  let state = GridState.CreateWithArray(ary_n2)
  expect(state.evaluation_amount_n2()).toStrictEqual([1, 0, 0, 0, 1])
})

test('state n3', () => {
  let state = GridState.CreateWithArray(ary_n3)
  expect(state.evaluation_amount_n3()).toStrictEqual([0, 1, 2, 3, 1])
})

test('state n4', () => {
  let state = GridState.CreateWithArray(ary_n4)
  expect(state.evaluation_amount_n4()).toStrictEqual([0, 3, 4])
})

test('state n5', () => {
  let state = GridState.CreateWithArray(ary_n5)
  expect(state.evaluation_amount_n5()).toStrictEqual([0, 1, 2, 3])
})

test('state days_n_day_workers', () => {
  let state = GridState.CreateWithArray(ary_s1)
  expect(state.days_n_day_workers()).toStrictEqual([1, 2, 0, 4, 3])
})

test('state days_n_night_workers', () => {
  let state = GridState.CreateWithArray(ary_s2)
  expect(state.days_n_night_workers()).toStrictEqual([1, 0, 2, 4, 3])
})

test('state workers_n_holidays', () => {
  let state = GridState.CreateWithArray(ary_n1)
  expect(state.workers_n_holidays()).toStrictEqual([7, 8, 6, 5])
})

test('state workers_weekend_holidays', () => {
  let state = GridState.CreateWithArray(ary_n2)
  expect(state.workers_weekend_holidays()).toStrictEqual([1, 0, 0, 0, 1])
})

test('state workers_serial_works', () => {
  let state = GridState.CreateWithArray(ary_n3)
  expect(state.workers_serial_works()).toStrictEqual([0, 1, 2, 3, 1])
})

test('state workers_day_after_night_work', () => {
  let state = GridState.CreateWithArray(ary_n4)
  expect(state.workers_day_after_night_work()).toStrictEqual([0, 3, 4])
})

test('state workers_serial_night_works', () => {
  let state = GridState.CreateWithArray(ary_n5)
  expect(state.workers_serial_night_works()).toStrictEqual([0, 1, 2, 3])
})

test('annealer temperature', () => {
  let annealer = new Annealer(1000, 0.1, 100)
  annealer.update(-10)
  expect(annealer.temperature).toBe(1000)
  annealer.update(110)
  expect(annealer.temperature).toBe(0.1)
  let expected = [
    1000.0,
    398.10717055349727,
    158.4893192461114,
    63.0957344480193,
    25.1188643150958,
    10.0,
    3.9810717055349696,
    1.5848931924611127,
    0.630957344480193,
    0.251188643150958,
    0.1,
  ]
  let actual = []
  for (let i = 0; i < 11; i++) {
    let t = i * 10
    annealer.update(t)
    actual.push(annealer.temperature)
  }
  for (let i = 0; i < expected.length; i++) {
    expect(actual[i]).toBeCloseTo(expected[i])
  }
})

test('annealer accept', () => {
  const eps = 0.001
  let annealer = new Annealer(10, 10, 100)
  expect(annealer.accept_prob(100, 90)).toBeCloseTo(1.0)
  expect(annealer.accept_prob(100, 80)).toBeCloseTo(1.0)
  expect(annealer.accept_prob(100, 110)).toBeCloseTo(Math.exp(-10 / (10 + eps)))
  expect(annealer.accept_prob(100, 110)).toBeCloseTo(0.36791622727622353)
  expect(annealer.accept_prob(100, 120)).toBeCloseTo(Math.exp(-20 / (10 + eps)))
  expect(annealer.accept_prob(100, 120)).toBeCloseTo(0.1353623502931698)
  annealer = new Annealer(1, 1, 100)
  expect(annealer.accept_prob(100, 90)).toBeCloseTo(1.0)
  expect(annealer.accept_prob(100, 80)).toBeCloseTo(1.0)
  expect(annealer.accept_prob(100, 110)).toBeCloseTo(Math.exp(-10 / (1 + eps)))
  expect(annealer.accept_prob(100, 110)).toBeCloseTo(4.585574854053304e-5)
  expect(annealer.accept_prob(100, 120)).toBeCloseTo(Math.exp(-20 / (1 + eps)))
  expect(annealer.accept_prob(100, 120)).toBeCloseTo(2.1027496742125976e-9)
})

