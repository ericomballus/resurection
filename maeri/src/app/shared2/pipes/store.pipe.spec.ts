import { StorePipe } from './store.pipe';

describe('StorePipe', () => {
  it('create an instance', () => {
    const pipe = new StorePipe();
    expect(pipe).toBeTruthy();
  });
});
