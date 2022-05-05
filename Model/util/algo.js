/**
 * array = [2, 3, 5, 2, 3, 3, 6, 5, 1, 1, 1, 2, 3, 9]
 * after applying lower Bound = 2:  [1, 2, 3, 5]
 * after sorting by occurrence: [3, 1, 2, 5]
 * https://stackoverflow.com/questions/34396767/sort-array-by-occurrence-of-its-elements
 * @param {[String]} array Array of IDs, where an ID can occure more than once
 * @param {Number} lowerBound IDs which occure less then this lower bound will be dropped
 * @returns {[String]} Set of IDs (IDs unique), ordered by occurrence rate in the input array, descending
 */
function sortByOcccurrence(array, lowerBound = 1) {
  let countArray = array.reduce(function (accumulator, currentValue) {
    //accumulator is an array
    //current value is a number from the array
    if (currentValue in accumulator) {
      accumulator[currentValue]++;
    } else {
      accumulator[currentValue] = 1;
    }
    return accumulator;
    //the second {} argument to the reduce function adds to a counted value in the countArray a key, which is the value of the
    //array on which .reduce gets called
  }, {});

  //console.log("countArray: ", countArray);

  // remove all elements which have a value < lower bound
  let filteredArray = {};
  Object.keys(countArray).forEach(function (key) {
    let value = countArray[key];
    if (value >= lowerBound) {
      filteredArray[key] = value;
    }
  });
  //console.log("filteredArray: ", filteredArray);
  countArray = filteredArray;

  //sort the keys (unique) of the countedArray by the values in the counted array
  let sortedArray = Object.keys(countArray).sort(function (a, b) {
    return countArray[b] - countArray[a];
  });

  //console.log("sortedArray: ", sortedArray);
  return sortedArray;
}
<<<<<<< HEAD
/**
 * Works like function sortByOcccurrence but accepts as nput a nested array[array[],array[],...]
 * merges these arrays together and calls sortByOcccurrence on this array
 * @param {*} array Array of Arrays with unique IDS, can have intersections
 * @param {Number} lowerBound IDs which occure less then this lower bound will be dropped
 * @returns {[String]} Set of IDs (IDs unique), ordered by occurrence rate in the input array, descending
 */
function sortByOcccurrenceNested(array, lowerBound = 1) {
  //array = [[1,2,3],[1,2,3,4],[2,3,4,5]];
  let concatArray = [];
  for (let i = 0; i < array.length; i++) {
    concatArray = concatArray.concat(array[i]);
  }
  //concatArray = [1,2,3,1,2,3,4,2,3,4,5];
  return sortByOcccurrence(concatArray, lowerBound);
}
module.exports = { sortByOcccurrence };
module.exports = { sortByOcccurrenceNested };
=======
// Calculate the average of all the numbers
function calculateMean(values) {
  const mean =
    values.reduce((sum, current) => sum + current, 0) / values.length;
  return mean;
}

// Calculate variance
function calculateVariance(values) {
  const average = calculateMean(values);
  const squareDiffs = values.map((value) => {
    const diff = value - average;
    return diff * diff;
  });
  const variance = calculateMean(squareDiffs);
  return variance;
}

// Calculate stand deviation
function calculateSD(variance) {
  return Math.sqrt(variance);
}
module.exports = {
  sortByOcccurrence,
  calculateMean,
  calculateVariance,
  calculateSD,
};
/* module.exports = { calculateMean };
module.exports = { calculateVariance };
module.exports = { calculateSD };
 */
>>>>>>> main
