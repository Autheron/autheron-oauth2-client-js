import { Hello } from '../src/index'

test('df', () => {
  expect(Hello('Dave')).toBe('Hello Dave');
});