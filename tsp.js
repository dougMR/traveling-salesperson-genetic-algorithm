// This trial is built from examples given in The Coding Train video:
// https://www.youtube.com/watch?v=r_SpBy9fQuo

const op = document.getElementById("output");

const swap = (vals, i, j) => {
    const temp = vals[i];
    vals[i] = vals[j];
    vals[j] = temp;
};

const shuffle = (array, num) => {
    for (let n = 0; n < num; n++) {
        let indexA = Math.floor(Math.random() * array.length);
        let indexB = Math.floor(Math.random() * array.length);
        swap(array, indexA, indexB);
    }
};


const generateCities = (howMany) => {
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
    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    order = order.slice(1, order.length - 1);

    const totalWays = factorialize(order.length);
    const bestOrder = [...order];

    let nextOrder = [...order];
    // let fullOrder = [startIndex, ...nextOrder, endIndex];
    let fullOrder = [...nextOrder];
    // const numericEndings = ['th','st','nd','rd','th','th','th','th','th','th'];
    const permuteOrder = () => {
        tries++;

        if (nextOrder === -1) {
            // return bestOrder;
            tspRunning = false;
            setButtonsStyles();
        } else {
            // fullOrder = [startIndex, ...nextOrder, endIndex];
            let fullOrder = [...nextOrder];
            // const numberEnding = numericEndings[tries % 10];
            op.innerHTML = `<strong>${tries.toLocaleString(
                "en-US"
            )}</strong> of <strong>${totalWays.toLocaleString(
                "en-US"
            )}</strong> ways for ${
                points.length - 2
            } points (plus static end points)<br/>• shortest path: <strong>${Math.round(
                shortestDist
            )}</strong> <span style="font-size: 1.1em; letter-spacing: -1px;">${bestOrder}</span><br/>• trying order: <span style="font-size: 1.4em; font-weight: bold;">${fullOrder}</span>`;
            // console.log("points: ", points);
            // console.log("fullOrder: ", fullOrder);
            const dist = calcTotalDistance(points, fullOrder);

            if (dist < shortestDist) {
                shortestDist = dist;
                bestOrder.length = 0;
                bestOrder.push(...fullOrder);
            }

            clearCanvas(ctx2);

            setLineColor("orange",ctx2);
            setLineWeight(4,ctx2);
            drawPath(arrangePointsByOrder(points, bestOrder),ctx2);
            drawPointsNumbers(points, ctx2);

            setLineColor("grey",ctx2);
            setLineWeight(1,ctx2);
            drawPath(arrangePointsByOrder(points, nextOrder), ctx2);

            // Get next permutation

            nextOrder = lexicalOrder(nextOrder);
            // console.log("nextOrder: ", nextOrder);

            if (tspRunning) requestAnimationFrame(permuteOrder);
        }
    };
    requestAnimationFrame(permuteOrder);
};

let tspRunning = false;
const setButtonsStyles = () => {
    if (tspRunning) {
        tspButton.classList.add("dimmed");
        tspStopButton.classList.remove("dimmed");
    } else {
        tspButton.classList.remove("dimmed");
        tspStopButton.classList.add("dimmed");
    }
};



/* 
----------------------------------------------------

// v From GENETIC ALGORITM TUTORIAL: https://www.youtube.com/watch?v=M3KTWnTrU_c

*/


const getShortestOrderByGeneticAlgorithmWithEndpoints = (points) => {

    const calculateFitness = () => {
        for (let p = 0; p < population.length; p++) {
            const dist = calcTotalDistance(points, population[p]);
            if (dist < shortestDist) {
                shortestDist = dist;
                bestOrder = [...population[p]];
            }
            fitness[p] = dist === 0 ? 0 : 1 / dist;
        }
    }
    
    const normalizeFitness = () => {
        //  for each value, set it to a fraction, which is its percentage of the total value
        let sum = 0;
        for (let f = 0; f < fitness.length; f++) {
            sum += fitness[f];
        }
        for (let f = 0; f < fitness.length; f++) {
            fitness[f] = fitness[f] / sum;
        }
    }
    
    const nextGeneration = () => {
        const newPopulation = [];
        for (let p = 0; p < population.length; p++) {
            const order = [...bestOrder];
            // const order = pickOneByFitness();
            // const orderA = pickOneByFitness(population);
            // const orderB = pickOneByFitness(population);
            // const order = crossover(orderA, orderB);
            mutate(order);
            newPopulation[p] = order;
        }
        population.length = 0;
        population.push(...newPopulation);
    }

    const pickOneByFitness = () => {
        let index = 0;
        let r = Math.random();

        while(r > 0) {
            r = r - fitness[index];
            index++;
        }
        index--;
        return [...population[index]];
    }

    const crossover = (orderA,orderB) => {
        const start = Math.floor(Math.random()*orderA.length);
        const end = start+1 + Math.floor(Math.random()*(orderA.length - (start+1)));
        const newOrder = orderA.slice(start,end);

        for(let b = 0; b < orderB.length; b++){
            const city = orderB[b];
            if(!newOrder.includes(city)){
                newOrder.push(city);
            }
        }
        return newOrder;
    }

    const mutate = (order) => {
        shuffle(order,1); 
    }


    const fitness = [];
    const population = [];
    let tries = 0;
    let shortestDist = Infinity;
    let order = [];
    for (let o = 0; o < points.length; o++) {
        order[o] = o;
    }
    let bestOrder = [...order];

    for (let p = 0; p < populationNum; p++) {
        population[p] = order.slice();
        shuffle(population[p], 10);
    }

    let record = shortestDist;
    const evolve = () => {
        calculateFitness();
        normalizeFitness();
        
        if(shortestDist !== record){
            record = shortestDist;
            console.log('shortestDist: ',shortestDist);
            console.log('iterations: ',tries);
        }
        nextGeneration();
        
        clearCanvas();
        setLineColor("lime");
        setLineWeight(4);
        // console.log('points',points);
        // console.log('bestOrder: ',bestOrder);
        drawPath(arrangePointsByOrder(points, bestOrder));
        drawPointsNumbers(arrangePointsByOrder(points, bestOrder));
    
        // setLineColor("grey");
        // setLineWeight(1);
        // drawPath(arrangePointsByOrder(points, nextOrder));
        tries ++;
        if(tries < maxTries ){
            requestAnimationFrame(evolve);
        } else {
            console.log("Done, ",tries, " tries.");
        }
    }

   requestAnimationFrame(evolve);
};
const numCities = document.getElementById("num-cities").value;
const cities = generateCities(numCities);
const populationNum = 100;
const maxTries = 50;
getShortestOrderByGeneticAlgorithmWithEndpoints(cities);


const runTsp = (evt) => {
    // console.log(evt);
    tspRunning = true;
    // const numCities = document.getElementById("num-cities").value;
    // const cities = generateCities(numCities);
    // getShortestOrder(cities);
    const startPoint = { x: 275, y: 290 };
    const endPoint = { x: 25, y: 290 };
    getShortestOrderWithEndpoints([
        startPoint,
        ...cities,
        endPoint,
    ]);
    setButtonsStyles();
};

const stopTsp = (evt) => {
    tspRunning = false;
    setButtonsStyles();
};
tspButton.addEventListener("click", runTsp);
tspStopButton.addEventListener("click", stopTsp);
runTsp();