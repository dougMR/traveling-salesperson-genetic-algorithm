// This trial is built from examples given in The Coding Train video:
// https://www.youtube.com/watch?v=r_SpBy9fQuo

const op = document.getElementById("output");
const cop1 = document.getElementById("canvas-1-output");
const cop2 = document.getElementById("canvas-2-output");

const swap = (vals, i, j) => {
    const temp = vals[i];
    vals[i] = vals[j];
    vals[j] = temp;
};

const shuffle = (array, num) => {
    for (let n = 0; n < num; n++) {
        let indexA = Math.floor(Math.random() * array.length);
        let indexB;
        do {
            indexB = Math.floor(Math.random() * array.length);
        } while (indexB === indexA);
        swap(array, indexA, indexB);
    }
};

const generateCities = (howMany) => {
    console.log("generateCieies()");
    // Each city is represented by a point (100x100)
    const cities = [];
    for (let i = 0; i < howMany; i++) {
        const x = 10 + Math.round(Math.random() * 280);
        const y = 10 + Math.round(Math.random() * 280);
        cities.push({ x, y });
    }
    return cities;
};

const calcTotalDistance = (points, order) => {
    // Simplified distance calcutation based just on series of coordinates
    let totalDist = 0;
    for (let o = 0; o < order.length - 1; o++) {
        const pointAIndex = order[o];
        const pointA = points[pointAIndex];
        const pointBIndex = order[o + 1];
        const pointB = points[pointBIndex];
        totalDist += getPointsDistance(pointA, pointB);
    }
    return totalDist;
};

const getPointsDistance = (p1, p2) => {
    // dist between 2 points
    const xDist = p2.x - p1.x;
    const yDist = p2.y - p1.y;
    const dist = Math.sqrt(xDist * xDist + yDist * yDist);
    return dist;
};

const arrangePointsByOrder = (points, order) => {
    const newPoints = [];
    for (let o = 0; o < order.length; o++) {
        const pointIndex = order[o];
        newPoints.push(points[pointIndex]);
    }
    return newPoints;
};
const lexicalOrder = (vals) => {
    // STEP 1: find the largest i such that vals[i]<vals[i+1]
    // (if there is no such i, vals is the last permutation)
    let largestI = -1;
    for (let i = 0; i < vals.length - 1; i++) {
        if (vals[i] < vals[i + 1]) {
            largestI = i;
        }
    }
    let largestJ = -1;
    if (largestI == -1) {
        // Don't loop
        return -1;
    } else {
        // STEP 2
        for (let j = 0; j < vals.length; j++) {
            if (vals[largestI] < vals[j]) {
                largestJ = j;
            }
        }
    }

    // SETP 3: swap
    swap(vals, largestI, largestJ);

    // STEP 4: reverse from largestI + 1 to the end
    const endArray = vals.splice(largestI + 1);
    endArray.reverse();
    vals.push(...endArray);
    return vals;
};

const getShortestOrderWithEndpoints = (points) => {
    // Try all permutations of path
    let tries = 0;
    let shortestDist = Infinity;
    let order = [];
    for (let o = 0; o < points.length; o++) {
        order[o] = o;
    }

    const startIndex = 0;
    const endIndex = order.length - 1;
    // const startPoint = points[0];
    // const endPoint = points[points.length - 1];
    order = order.slice(1, order.length - 1);

    const totalWays = factorialize(order.length);
    const bestOrder = [...order];

    let nextOrder = [...order];
    let fullOrder = [startIndex, ...nextOrder, endIndex];
    // let fullOrder = [...nextOrder];
    // const numericEndings = ['th','st','nd','rd','th','th','th','th','th','th'];
    const permuteOrder = () => {
        tries++;

        if (nextOrder === -1) {
            // return bestOrder;
            permuteRunning = false;
            setButtonsStyles();
        } else {
            fullOrder = [startIndex, ...nextOrder, endIndex];
            // let fullOrder = [...nextOrder];
            // const numberEnding = numericEndings[tries % 10];
            cop2.innerHTML = `<span class="output-title">trial-and-error - 'brute-force'</span><br/><strong>${tries.toLocaleString(
                "en-US"
            )}</strong> of <strong>${totalWays.toLocaleString(
                "en-US"
            )}</strong> ways<br/>shortest path: <strong>${Math.round(
                shortestDist
            )}</strong> <span style="letter-spacing: -1px;">${bestOrder}</span>`;
            // console.log("points: ", points);
            // console.log("fullOrder: ", fullOrder);
            const dist = calcTotalDistance(points, fullOrder);

            if (dist < shortestDist) {
                shortestDist = dist;
                bestOrder.length = 0;
                bestOrder.push(...fullOrder);
            }

            clearCanvas(ctx2);

            setLineColor("orange", ctx2);
            setLineWeight(4, ctx2);
            drawPath(arrangePointsByOrder(points, bestOrder), ctx2);
            drawPointsNumbers(points, ctx2);

            setLineColor("grey", ctx2);
            setLineWeight(1, ctx2);
            drawPath(arrangePointsByOrder(points, nextOrder), ctx2);

            // Get next permutation

            lexicalOrder(nextOrder);
            // console.log("nextOrder: ", nextOrder);

            if (permuteRunning) requestAnimationFrame(permuteOrder);
        }
    };
    requestAnimationFrame(permuteOrder);
};

/* 
----------------------------------------------------

// v From GENETIC ALGORITM TUTORIAL: https://www.youtube.com/watch?v=M3KTWnTrU_c

*/

const getShortestOrderByGeneticAlgorithmWithEndpoints = (points) => {
    const addStartEndIndexes = (thisOrder) => {
        return [startIndex, ...thisOrder, endIndex];
    };
    const stripStartEndIndexes = (thisOrder) => {
        const newOrder = [...thisOrder];
        newOrder.pop();
        newOrder.shift();
        return newOrder;
    };
    const addEndpoints = (points) => {
        return [startPoint, ...points, endPoint];
    };
    const stripEndpoints = (points) => {
        const newPoints = [...points];
        newPoints.pop();
        newPoints.shift();
        return newPoints;
    };

    const checkSwapEvery2PointsOfPopulation = () => {
        for (let p = 0; p < population.length; p++) {
            population[p] = checkSwapEvery2Points(population[p]);
        }
    };
    const checkSwapEvery2Points = (order) => {
        // with every pair of points,
        // check if dist is shorter by swapping them
        let shortestDist = calcTotalDistance(
            points,
            addStartEndIndexes(order)
        );

        let newOrder = [...order];
        let foundShorter = false;

        for (let i = 0; i < order.length; i++) {
            for (let j = i + 1; j < order.length; j++) {
                const swappedOrder = [...newOrder];
                swap(swappedOrder, i, j);

                const dist = calcTotalDistance(
                    points,
                    addStartEndIndexes(swappedOrder)
                );
                if (dist < shortestDist) {
                    shortestDist = dist;
                    newOrder = [...swappedOrder];
                    foundShorter = true;
                }
            }
        }
        if (foundShorter) {
            // console.log("checkSwap found shorter path");
            return newOrder;
        }
        return order;
    };

    const checkSwapEvery2PointsOfBest = () => {
        // with every pair of points,
        // check if dist is shorter by swapping them
        let newOrder = [...bestOrder];
        let foundShorter = false;

        for (let i = 0; i < order.length; i++) {
            for (let j = i + 1; j < order.length; j++) {
                const swappedOrder = [...newOrder];
                swap(swappedOrder, i, j);

                const dist = calcTotalDistance(
                    points,
                    addStartEndIndexes(swappedOrder)
                );
                if (dist < shortestDist) {
                    console.log('new shortest dist: ',dist);
                    shortestDist = dist;
                    newOrder = [...swappedOrder];
                    foundShorter = true;
                }
            }
        }
        if (foundShorter) {
            console.log("checkSwap found shorter path");
            bestOrder = [...newOrder];
            return true;
        }
        return false;
    };

    const calculateFitness = () => {
        for (let p = 0; p < population.length; p++) {
            const dist = calcTotalDistance(
                points,
                addStartEndIndexes(population[p])
            );
            if (dist < shortestDist) {
                shortestDist = dist;
                bestOrder = [...population[p]];
                // only checkSwap when new shortestDist is found
                while (checkSwapEvery2PointsOfBest()) {
                    // just keep doing that until it doesn't improve
                }

                numMutations = 1;
            } else {
                numMutations++;
                numMutations = Math.min(numMutations, order.length);
            }
            fitness[p] = dist === 0 ? 0 : 1 / dist;
        }
    };

    const normalizeFitness = () => {
        // console.log('normalizeFitness()');
        //  for each value, set it to a fraction, which is its percentage of the total value
        let sum = 0;
        for (let f = 0; f < fitness.length; f++) {
            sum += fitness[f];
        }
        for (let f = 0; f < fitness.length; f++) {
            fitness[f] = fitness[f] / sum;
        }
    };

    const nextGeneration = () => {
        // console.log('nextGeneration()');
        // console.log("numMutations: ", numMutations);
        // console.log('population.length: ',population.length);
        const newPopulation = [];
        ordersTried.length = 0;
        lookedForRepeat = 0;
        for (let p = 0; p < population.length; p++) {
            // const newOrder = [...bestOrder];
            const oldOrder = [...population[p]];
            const newOrder = pickOneByFitness();
            // const orderA = pickOneByFitness(population);
            // const orderB = pickOneByFitness(population);
            // const order = crossover(orderA, orderB);
            // shuffle(newOrder, numMutations);
            // newPopulation[p] = newOrder;

            // reset ordersTried.
            // it gets too long, but clearing it here we can check just that newPopulation doesn't repeat orders
            
            let loops = 0;
            do {
                shuffle(newOrder, numMutations);
                loops++;
            } while (
                checkOrderAlreadyTried(newOrder) &&
                loops < maxCheckNewOrderLoops
            );
            // console.log('loops: ',loops, 'vs', maxCheckNewOrderLoops);
            if (loops + 2 < maxCheckNewOrderLoops) {
                newPopulation[p] = newOrder;
            } else {
                newPopulation[p] = oldOrder;
                console.log("no new order for this population");
            }
        }
        population.length = 0;
        population.push(...newPopulation);
        // console.log('population.length 2: ',population.length);
    };

    const pickOneByFitness = () => {
        let index = 0;
        let r = Math.random();

        while (r > 0) {
            r = r - fitness[index];
            index++;
        }
        index--;
        return [...population[index]];
    };

    const crossover = (orderA, orderB) => {
        const start = Math.floor(Math.random() * orderA.length);
        const end =
            start +
            1 +
            Math.floor(Math.random() * (orderA.length - (start + 1)));
        const newOrder = orderA.slice(start, end);

        for (let b = 0; b < orderB.length; b++) {
            const city = orderB[b];
            if (!newOrder.includes(city)) {
                newOrder.push(city);
            }
        }
        return newOrder;
    };

    const mutate = (order) => {
        shuffle(order, 1);
    };

    let lookedForRepeat = 0;
    let foundRepeat = 0;
    let uniqueOrdersTried = 0;
    const foundUsedOrder = () => {
        foundRepeat++;
        op.innerHTML = `Found ${foundRepeat.toLocaleString(
            "en-US"
        )} repeats of ${lookedForRepeat.toLocaleString("en-US")} checks (${
            Math.round((foundRepeat / lookedForRepeat) * 100) + "%"
        })<br/>${uniqueOrdersTried.toLocaleString(
            "en-US"
        )} unique orders tried`;
    };
    const checkOrderAlreadyTried = (order) => {
        let nextNestedArray = ordersTried;
        for (let i = 0; i < order.length; i++) {
            const index = order[i];
            if (i < order.length - 1) {
                // not final index
                if (!Array.isArray(nextNestedArray[index])) {
                    // No array here yet
                    nextNestedArray[index] = [];
                }
                nextNestedArray = nextNestedArray[index];
            } else {
                op.innerHTML = `Found ${foundRepeat.toLocaleString(
                    "en-US"
                )} repeats of ${lookedForRepeat.toLocaleString("en-US")} checks (${
                    Math.round((foundRepeat / lookedForRepeat) * 100) + "%"
                })<br/>${uniqueOrdersTried.toLocaleString(
                    "en-US"
                )} unique orders tried`;
                // reached endpoint, check if it's been used yet
                lookedForRepeat++;
                if (typeof nextNestedArray[index] != "number") {
                    // First time here
                    nextNestedArray[index] = 1;
                    uniqueOrdersTried++;
                    return false;
                } else {
                    // Been here before
                    foundUsedOrder();
                    nextNestedArray[index]++;
                    return true;
                }
                console.log("nextNestedArray[index]", nextNestedArray[index]);
            }
        }
        
    };
    // const checkOrderAlreadyTried = (order) => {
    //     const index = Number(order.join(""));
    //     // console.log(typeof index);
    //     lookedForRepeat++;
    //     if (typeof ordersTried[index] != "undefined") {
    //         // already tried
    //         ordersTried[index]++;
    //         foundUsedOrder(index);
    //         return true;
    //     } else {
    //         // not tried yet, add it
    //         ordersTried[index] = 1;
    //         return false;
    //     }

    //     // let nextLevelArray = ordersTried;
    //     // for( let o = 0; o < order.length; o++){
    //     //     // const digit1 = order[o].toString();
    //     //     // const digit2 = o+1 < order.length ? order[o+1].toString() : '';
    //     //     // const index = Number(digit1+digit2);
    //     //     const nextLevelItem = nextLevelArray[order[o]];
    //     //     if()
    //     // }
    // };

    const ordersTried = [];
    const maxTries = Math.pow(points.length, 2);
    const populationNum = 100 + maxTries * 2;
    const maxCheckNewOrderLoops = Math.pow(points.length, 2);
    console.log("maxTries: ", maxTries);
    console.log("populationNum: ", populationNum);
    console.log("maxCheckNewOrderLoops", maxCheckNewOrderLoops);

    const fitness = [];
    const population = [];
    let tries = 0;
    let shortestDist = Infinity;
    let numMutations = 1;
    let order = [];
    for (let o = 0; o < points.length; o++) {
        order[o] = o;
    }
    const startIndex = 0;
    const endIndex = order.length - 1;
    order = stripStartEndIndexes([...order]);

    let bestOrder = [...order];

    for (let p = 0; p < populationNum; p++) {
        population[p] = [...order];
        shuffle(population[p], 10);
    }

    let record = shortestDist;
    const evolve = () => {
        // console.log('evolve()');
        // console.log('tries',tries);
        calculateFitness();
        normalizeFitness();
        checkSwapEvery2PointsOfPopulation();

        if (shortestDist !== record) {
            record = shortestDist;
            console.log("shortestDist: ", Math.round(shortestDist));
            console.log("iterations: ", tries);
        }
        nextGeneration();
        clearCanvas();
        setLineColor("lime");
        setLineWeight(4);
        // console.log('points',points);
        // console.log('bestOrder: ',bestOrder);
        // console.log('bestOrder: ',bestOrder);
        drawPath(arrangePointsByOrder(points, addStartEndIndexes(bestOrder)));
        drawPointsNumbers(
            arrangePointsByOrder(points, addStartEndIndexes(bestOrder))
        );

        // setLineColor("grey");
        // setLineWeight(1);
        // drawPath(arrangePointsByOrder(points, nextOrder));
        tries++;
        cop1.innerHTML = `<span class="output-title">mutations - 'genetic algorithm'</span><br/> <strong>${tries}</strong> of <strong>${maxTries}</strong> passes<br/>shortest path: <strong>${Math.round(
            shortestDist
        )}</strong> ${addStartEndIndexes(bestOrder)}`;
        if (tries < maxTries && evolveRunning) {
            requestAnimationFrame(evolve);
        } else {
            console.log("Done, ", tries, " tries.");
            evolveRunning = false;
            setButtonsStyles();
            console.log("ordersTried.length", ordersTried.length);
        }
    };

    requestAnimationFrame(evolve);
};

const runTsp = (evt) => {
    console.clear();
    // console.log(evt);
    // tspRunning = true;

    if (!samePointsCheckbox.checked || numCities === 0) {
        numCities = document.getElementById("num-cities").value;
        cities = generateCities(numCities);
    }

    op.innerHTML = `<span style="font-family: sans-serif;">${cities.length} points - plus static end points`;
    // const numCities = document.getElementById("num-cities").value;
    // const cities = generateCities(numCities);
    // getShortestOrder(cities);
    const startPoint = { x: 275, y: 290 };
    const endPoint = { x: 25, y: 290 };
    if (bruteForceCheckbox.checked) {
        permuteRunning = true;
        getShortestOrderWithEndpoints([startPoint, ...cities, endPoint]);
    }

    if (mutateCheckbox.checked) {
        evolveRunning = true;
        getShortestOrderByGeneticAlgorithmWithEndpoints([
            startPoint,
            ...cities,
            endPoint,
        ]);
    }

    setButtonsStyles();
};

const stopTsp = (evt) => {
    // tspRunning = false;
    permuteRunning = false;
    evolveRunning = false;
    setButtonsStyles();
};

const setButtonsStyles = () => {
    console.log("setButtonStyles()");
    console.log("permuteRunning: ", permuteRunning);
    if (evolveRunning || permuteRunning) {
        tspButton.classList.add("dimmed");
        tspStopButton.classList.remove("dimmed");
    } else {
        tspButton.classList.remove("dimmed");
        tspStopButton.classList.add("dimmed");
    }
};
// let tspRunning = false;
let permuteRunning = false;
let evolveRunning = false;

let cities;
let numCities = 0;
tspButton.addEventListener("click", runTsp);
tspStopButton.addEventListener("click", stopTsp);

// runTsp();
console.log(Math.pow(16, 16).toLocaleString("en-US"));

const getNumComparisons = (order) => {
    let comparisons = 0;
    for (let i = 0; i < order.length; i++) {
        for (let j = i + 1; j < order.length; j++) {
            comparisons++;
        }
    }
    console.log(`${order.length} items = ${comparisons} comparisons`);
};
getNumComparisons([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
