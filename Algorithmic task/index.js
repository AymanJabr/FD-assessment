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
    pathCount; // Number of paths that lead to this device

    constructor(id) {
        this.id = id;
        this.outputs = [];
        this.pathCount = 0;
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
let visitedDevices = new Set();
let successfulDevices = new Set(["out"]);
let queueSet = new Set(["you"]);

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
    visitedDevices = new Set();
    successfulDevices = new Set(["out"]);
    queueSet = new Set(["you"]);
    pathCount = 0;

    // Initialize: "you" has 1 path leading to it
    devicesMap["you"].pathCount = 1;

    while (queue.length > 0) {
        // 1 => Take/Remove the first element of the queue, and add it to the visitedDevices array
        const currentDeviceId = queue.shift();
        queueSet.delete(currentDeviceId);
        visitedDevices.add(currentDeviceId);

        const currentDevice = devicesMap[currentDeviceId];

        if (!currentDevice) {
            continue;
        }

        // 2 => For it's outputs, we are going to go output by output
        for (const output of currentDevice.outputs) {
            // 2.1 => we are going to check if any of them is in the successfulDevices array
            if (successfulDevices.has(output)) {
                // if so, add all paths from current device to the total count
                pathCount += currentDevice.pathCount;
                if (!successfulDevices.has(currentDeviceId)) {
                    successfulDevices.add(currentDeviceId);
                }
            }
            // 2.2 => If not, we are going check the visitedDevices array, if it's in this array we are going to skip this output
            else if (visitedDevices.has(output)) {
                continue;
            }
            // 2.3 => If not, we are going to add it to the queue
            else {
                if (!queueSet.has(output)) {
                    queue.push(output);
                    queueSet.add(output);
                }
                // Accumulate paths: add current device's path count to the output device
                if (devicesMap[output]) {
                    devicesMap[output].pathCount += currentDevice.pathCount;
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
