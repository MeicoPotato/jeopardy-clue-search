class Ahocorasick {
    constructor(keywords) {
        this.buildTables(keywords);
    }

    buildTables(keywords) {
        let gotoFn = {
            0: {}
        };

        let output = {};
        let failure = {};
        let xs = [];
        let state = 0;

        keywords.forEach((word) => {
            let curr = 0;

            for (let i = 0; i < word.length; i++) {
                let comparator = word[i];
                if (gotoFn[curr] && comparator in gotoFn[curr]) {
                    curr = gotoFn[curr][comparator];
                } else {
                    state++;
                    gotoFn[curr][comparator] = state;
                    gotoFn[state] = {};
                    curr = state;
                    output[state] = [];
                }
            }

            output[curr].push(word);
        });

        // f(s) = 0 for all states of depth 1 (the ones from which the 0 state can transition to)
        for (let l in gotoFn[0]) {
            let state = gotoFn[0][l];
            failure[state] = 0;
            xs.push(state);
        }

        while (xs.length) {
            let r = xs.shift();
            // for each symbol a such that g(r, a) = s
            for (let l in gotoFn[r]) {
                let s = gotoFn[r][l];
                xs.push(s);

                // set state = f(r)
                let state = failure[r];
                while (state > 0 && !(l in gotoFn[state])) {
                    state = failure[state];
                }

                if (l in gotoFn[state]) {
                    let fs = gotoFn[state][l];
                    failure[s] = fs;
                    output[s] = output[s].concat(output[fs]);
                }
                else {
                    failure[s] = 0;
                }
            }
        }

        this.gotoFn = gotoFn;
        this.output = output;
        this.failure = failure;
    }

    searchAhocorasick(string) {
        let state = 0;
        let results = [];
        for (let i = 0; i < string.length; i++) {
            let l = string[i];
            while (state > 0 && !(l in this.gotoFn[state])) {
                state = this.failure[state];
            }
            if (!(l in this.gotoFn[state])) {
                continue;
            }

            state = this.gotoFn[state][l];

            if (this.output[state].length) {
                let foundStrs = this.output[state];
                results.push([i, foundStrs]);
            }
        }

        return results;
    }

    exports = Ahocorasick;
}