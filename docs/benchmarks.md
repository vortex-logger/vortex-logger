
# Benchmarks

`zenlog.info('hello world')`:

```

BASIC benchmark averages
Bunyan average: 377.434ms
Winston average: 270.249ms
Bole average: 172.690ms
Debug average: 220.527ms
LogLevel average: 222.802ms
Zenlog average: 114.801ms
ZenlogMinLength average: 70.968ms
ZenlogNodeStream average: 159.192ms

```

`zenlog.info({'hello': 'world'})`:

```

OBJECT benchmark averages
BunyanObj average: 410.379ms
WinstonObj average: 273.120ms
BoleObj average: 185.069ms
LogLevelObject average: 433.425ms
ZenlogObj average: 119.315ms
ZenlogMinLengthObj average: 76.968ms
ZenlogNodeStreamObj average: 164.268ms

```

`zenlog.info(aBigDeeplyNestedObject)`:

```

DEEP-OBJECT benchmark averages
BunyanDeepObj average: 1.839ms
WinstonDeepObj average: 5.604ms
BoleDeepObj average: 3.422ms
LogLevelDeepObj average: 11.716ms
ZenlogDeepObj average: 2.256ms
ZenlogMinLengthDeepObj average: 2.240ms
ZenlogNodeStreamDeepObj average: 2.595ms

```

`zenlog.info('hello %s %j %d', 'world', {obj: true}, 4, {another: 'obj'})`:

For a fair comparison, [LogLevel](http://npm.im/loglevel) was extended
to include a timestamp and [bole](http://npm.im/bole) had
`fastTime` mode switched on.

