// Input Example:

// aaa: you hhh
// you: bbb ccc
// bbb: ddd eee
// ccc: ddd eee fff
// ddd: ggg iii
// eee: out
// fff: out
// ggg: out
// hhh: ccc fff iii
// iii: out

//  1) Let's create a Device Object
class Device {

    id;
    outputs;

    constructor(id) {
        this.id = id;
        this.outputs = [];
    }
}

// 2) We convert the input in the format given in the example, to Devices
function parseInputToDevices(input) {
    const devicesMap = {};

    if (!input || input.trim() === "") {
        return devicesMap;
    }

    const lines = input.trim().split('\n');

    for (const line of lines) {
        const [id, outputsStr] = line.split(':');
        const deviceId = id.trim();
        const outputs = outputsStr.trim().split(' ').filter(o => o.length > 0);

        const device = new Device(deviceId);
        device.outputs = outputs;
        devicesMap[deviceId] = device;
    }

    return devicesMap;
}


// 3) 
// Now we will need 3 arrays, and a counter:
// - queue: to determine the next device to visit
// - visitedDevices: to keep track of visited devices
// - successfulDevices: In our example, we know that device "fff" can get us to "out", so any new path that leads to "fff" is a successful path
let queue = ["you"];
let visitedDevices = [];
let successfulDevices = ["out"];

let pathCount = 0;

// 4) This is where we start with the actual algorithm, we are going to start with the node "you" in the queue, we are going to:
// 1 => Take/Remove the first element of the queue, and add it to the visitedDevices array
// 2 => For it's outputs, we are going to go output by output
//    2.1 => we are going to check if any of them is in the successfulDevices array, if so, we are going to increment the pathCount, and add the current node to the successfulDevices Array
//    2.2 => If not, we are going check the visitedDevices array, if it's in this array we are going to skip this output
//    2.3 => If not, we are going to add it to the queue
// 3 => Once the queue is empty, we are going to return the pathCount

function countPaths(devicesMap) {
    if (!devicesMap["you"]) {
        return 0;
    }

    // Reset variables
    queue = ["you"];
    visitedDevices = [];
    successfulDevices = ["out"];
    pathCount = 0;

    while (queue.length > 0) {
        // 1 => Take/Remove the first element of the queue, and add it to the visitedDevices array
        const currentDeviceId = queue.shift();
        visitedDevices.push(currentDeviceId);

        const currentDevice = devicesMap[currentDeviceId];

        if (!currentDevice) {
            continue;
        }

        // 2 => For it's outputs, we are going to go output by output
        for (const output of currentDevice.outputs) {
            // 2.1 => we are going to check if any of them is in the successfulDevices array
            if (successfulDevices.includes(output)) {
                // if so, we are going to increment the pathCount, and add the current node to the successfulDevices Array
                pathCount++;
                if (!successfulDevices.includes(currentDeviceId)) {
                    successfulDevices.push(currentDeviceId);
                }
            }
            // 2.2 => If not, we are going check the visitedDevices array, if it's in this array we are going to skip this output
            else if (visitedDevices.includes(output)) {
                continue;
            }
            // 2.3 => If not, we are going to add it to the queue
            else {
                if (!queue.includes(output)) {
                    queue.push(output);
                }
            }
        }
    }

    // 3 => Once the queue is empty, we are going to return the pathCount
    return pathCount;
}

// Test the algorithm
const testCases = require('./tests.js');
testCases.forEach((test) => {
    console.log(`\n${test.name}`);
    const devicesMap = parseInputToDevices(test.input);
    const result = countPaths(devicesMap);
    console.log(`Result: ${result}`);
    console.log(`Expected: ${test.expected !== null ? test.expected : 'Unknown'}`);
    if (test.expected !== null) {
        console.log(result === test.expected ? '✓ PASS' : '✗ FAIL');
    }
});
