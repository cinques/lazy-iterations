const {filter, map, list} = require('lazy-iterations');

test('lmap', () => {
    const sut = [0, 1, 2]
        .lmap(x => x + 1)
        .toArray();
    expect(sut).toEqual(expect.arrayContaining([1, 2, 3]));
});

test('lfilter', () => {
    const sut = [0, 1, 2]
        .lfilter(x => x !== 2)
        .toArray();
    expect(sut).toEqual(expect.arrayContaining([0, 1]));
});

test('map', () => {
    const sut = list(map(x => x + 1, [0, 1, 2]));
    expect(sut).toEqual(expect.arrayContaining([1, 2, 3]));
});

test('filter', () => {
    const sut = list(filter(x => x !== 2, [0, 1, 2]));
    expect(sut).toEqual(expect.arrayContaining([0, 1]));
});


test('lmap-lfilter', () => {
    const sut = [0, 1, 2, 3, 4]
        .lmap(x => x ** 2)
        .lfilter(x => x % 2)
        .toArray();

    expect(sut).toEqual(expect.arrayContaining([1, 9]));
});

test('map-filter', () => {
    const powered = map(x => x ** 2, [0, 1, 2, 3, 4]);
    const evens = filter(x => x % 2, powered);
    const sut = list(evens);

    expect(sut).toEqual(expect.arrayContaining([1, 9]));
});