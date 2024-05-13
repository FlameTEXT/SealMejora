import { sum } from './sum';
import test from 'ava'

test("sum(1,1)", (t) => {
  t.is(sum(1,1), 2);
});

