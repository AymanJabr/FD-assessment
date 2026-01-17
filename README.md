# Flatex DEGIRO Assignment

This repository contains solutions for two Interview assignments:

## TypeScript/React Assignment

For an international online marketplace you need to implement a delivery address picker component:

* A user selects a country where the package should be sent.
* The marketplace suggests a list of regions/provinces based on the selected country.
* After a user selects the region, a list of cities, towns, and villages is suggested.
* A user selects a city and then types in the remaining address details (street, house number, apartment number, etc.)

The information about countries, regions, and cities comes from the backend API. Unfortunately, the backend is running
on legacy hardware, so we need to minimize the number of requests to the backend by implementing a smart caching
mechanism on the frontend. As soon as we fetch the list of regions for a country, we store it in the cache and reuse it
when the user selects the same country again. The same logic applies to cities.

Additionally, the product owner is considering allowing street names to be selected from a list of suggestions in a
future release. Therefore, the caching mechanism should be implemented in a generic way to support caching any data
fetched from the backend. As a developer, you also recognize that this caching approach could be reused across other
pages of the marketplace.

### The task

Please design and implement the address picker component and the reusable caching mechanism.

The project should be implemented using the TypeScript/React stack. The outcome should be a ready-to-run project.

The data for countries, regions, and cities may come from any source (a mock, a real API, etc.); see the "Bonus points"
section below. It is not necessary to provide an exhaustive list of all countries, regions, and cities—a small subset is
sufficient to demonstrate the application.

### Bonus points

1. Create a simple backend implementation using any other stack/technology of your choice (except Node.js/TypeScript).
   This part of code will not be evaluated.

2. Create a basic `Dockerfile` to containerize the frontend (and backend if you completed the previous bonus point)
   applications.

See [`typescript-assignment/`](./typescript-assignment/) for the delivery address picker implementation with smart caching. Full-stack application with Python backend, Next.js frontend, and Redis.

## Algorithmic Task

You hear a persistent alarm coming from the factory floor, so you go to investigate. Inside, you find several heavy electrical conduits.

After an investigation, you locate the source of the alarm: a large power unit that supplies the factory. A few technicians are moving quickly between the unit and a nearby server rack, clearly trying to resolve an outage.

One of them spots you and hurries over. "Perfect timing. We just installed a new server rack, but we can't get the power unit's controller to communicate with it." 

You look around and see a dense bundle of cabling and interface modules running between the rack and the controller. The technician returns with an inventory of the connected devices and their outputs.

For example:
```text
aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg iii
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out
```

Each line in the input lists a device name followed by the devices that its outputs connect to. For example, `bbb: ddd eee` means device `bbb` has two output connections: one to `ddd` and one to `eee`.

The team believes the problem isn't caused by a single faulty device, but by data traversing a particular route through the network. Data only moves forward from a device to its outputs; it does not travel in reverse.

Your assignment is to analyze the subsystem starting at the device labeled `you` (the one next to you) and ending at the controller's primary output, labeled `out`.

To help isolate the failure, identify every possible path through the device network from `you` to `out`.

In this example, these are all of the paths from you to out:

    [1] Data could go from you > bbb > ddd > ggg > out.
    [2] Data could go from you > ccc > ddd > iii > out.
    [3] Data could go from you > bbb > ddd > iii > out.
    [4] Data could go from you > bbb > eee > out.
    [5] Data could go from you > ccc > ddd > ggg > out.
    [6] Data could go from you > ccc > eee > out.
    [7] Data could go from you > ccc > fff > out.

In total, there are 7 different paths leading from `you` to `out`.

Your job is to determine how many different paths lead from `you` to `out`

**Write a small program that is capable of solving this issue and share it with us.**
____


Input:

```text
the: taq aki
fnc: shq dvj nhp ule
eub: pxs you apo
fde: out
bsp: shq dvj nhp....
```

See [`Algorithmic task/`](./Algorithmic%20task/) for the graph pathfinding solution.

