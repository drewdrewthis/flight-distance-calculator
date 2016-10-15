## Overview

Design and implement a single-page application that calculates and displays, given user input, the distance between two airports.

## Requirements

- A simple, clean design that puts easy user interaction first
- Flights only between the following airports - JFK, LAX, LAS, PDX
- Use best practice (HTML/CSS/Javascript)
- Use of jQuery is acceptable

## Bonuses

- Think outside the norm - surprise us!

## Tools provided

You have at your disposal two Javascript functions - `IntentMedia.Distances.distance_between_airports` - which takes two, three letter airport codes as arguments, and `IntentMedia.Airports.airport_exists` which takes one, three letter airport code. 

An example usage of the `distance_between_airports` function is:

```javascript
> IntentMedia.Distances.distance_between_airports("JFK", "LAX")
2475

> IntentMedia.Distances.distance_between_airports("JFK", "JFK")
0

> IntentMedia.Distances.distance_between_airports("JFK", "NON")
-1
```

An example usage of the `airport_exists` function is:

```javascript
> IntentMedia.Airports.airport_exists("JFK")
true

> IntentMedia.Airports.airport_exists("NON")
false
```
