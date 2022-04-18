/**
 * array = [2, 3, 5, 2, 3, 3, 6, 5, 1, 1, 1, 2, 3, 9]
 * after applying lower Bound = 2:  [1, 2, 3, 5]
 * after sorting by occurrence: [3, 1, 2, 5]
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

module.exports = { sortByOcccurrence };
