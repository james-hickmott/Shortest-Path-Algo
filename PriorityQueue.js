export class nodePriorityQueue {

    #data = []; // PRIVATE ATTRIBUTE

    constructor(data = []){
        this.#data = data;
    }

    get get(){
        // returns highest priority element
        if (this.#data.length > 0) {
            return this.#data[0][0];
        }
        throw 'Queue Empty';
    }

    add(node, value) {
        // adds a node and its value at a specific index
        for (let i of this.#data) {
            if (value < i[1]) {
                this.#data.splice((this.#data.indexOf(i)), 0, [node, value])
                return;
            }
        }
        this.#data.push([node, value]);
    }

    remove(node) {
        // removes a node and its value
        for (let i = 0; i < this.#data.length; i++) {
            if (this.#data[i][0] == node) {
                this.#data.splice(i, 1);
                return;
            }
        }
        throw 'Cant find item';
    }

    clear() {
        // delete whole queue
        this.#data.splice(0, this.#data.length)
    }

    show() {
        // console.logs the queue
        console.log(this.#data);
    }

    sort() {
        // sorts the queue if you have predefined queue
        this.#data = bubbleSort(this.#data)
    }

    data() {
        // get raw data of queue
        return this.#data;
    }

    has(node) {
        // check whether the queue contains a value
        for (let i of this.#data) {
            if (i[0] == node) {
                return true;
            }
        }
        return false;
    }
}

// bubble sort is used to sort the list
// if the user wants to use a pre-defined list
function bubbleSort (List) {
    let n = List.length;
    let temp;
    let swapped = true;
    while (swapped == true) {
        swapped = false;
        for (let i = 0; i < n-1 ; i++) {
            if (List[i][1] > List[i+1][1]) {
                temp = [List[i], List[i+1]];
                List[i] = temp[1];
                List[i+1] = temp[0];
                swapped = true;
            }
        }
    }
    return List;
}