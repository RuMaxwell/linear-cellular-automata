srcfiles = src/Core.ts
testfiles = test/test.ts
testjs = test/test.js

default: src buildtest test

src: ${srcfiles}
	tsc ${srcfiles}

buildtest: ${testfiles}
	tsc ${testfiles}

test: ${testjs}
	node ${testjs}

