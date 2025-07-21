
# Benchmarks

`bingo.info('hello world')`:

```

BASIC benchmark averages
Bunyan average: 377.434ms
Winston average: 270.249ms
Bole average: 172.690ms
Debug average: 220.527ms
LogLevel average: 222.802ms
Bingo average: 114.801ms
BingoMinLength average: 70.968ms
BingoNodeStream average: 159.192ms

```

`bingo.info({'hello': 'world'})`:

```

OBJECT benchmark averages
BunyanObj average: 410.379ms
WinstonObj average: 273.120ms
BoleObj average: 185.069ms
LogLevelObject average: 433.425ms
BingoObj average: 119.315ms
BingoMinLengthObj average: 76.968ms
BingoNodeStreamObj average: 164.268ms

```

`bingo.info(aBigDeeplyNestedObject)`:

```

DEEP-OBJECT benchmark averages
BunyanDeepObj average: 1.839ms
WinstonDeepObj average: 5.604ms
BoleDeepObj average: 3.422ms
LogLevelDeepObj average: 11.716ms
BingoDeepObj average: 2.256ms
BingoMinLengthDeepObj average: 2.240ms
BingoNodeStreamDeepObj average: 2.595ms

```

`bingo.info('hello %s %j %d', 'world', {obj: true}, 4, {another: 'obj'})`:

For a fair comparison, [LogLevel](http://npm.im/loglevel) was extended
to include a timestamp and [bole](http://npm.im/bole) had
`fastTime` mode switched on.

