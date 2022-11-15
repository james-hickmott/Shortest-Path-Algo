export function getHeuristic(start, end) {
    // get distance from two nodes
    // using pythagoras
    return ((((end.ordinates[0] - start.ordinates[0])**2)+((end.ordinates[1] - start.ordinates[1])**2))**(1/2));
}

export function CMPArrays(a, b) {
    // return true if a and b are same
    // else returns false
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i])  return false;
    }
    return true;
}
  
export function RemoveFromArray(array, element) {
    // removes an element from the array
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
        array.pop(i);
        }
    }
}