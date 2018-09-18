## Share Houses Map
The web page shows the share houses in Taipei; hosted on Firebase.
See the [page](https://co-living.firebaseapp.com).

## Data Schema
```js
// collection companies
{
  "name": "",
  "web":  "https://..."
}

// collection houses
{
  "address":    "",
  "company":    {},   // firebase.firestore.DocumentReference
  "extra_fees": false // true: yes, false: no extra fee or already included
  "location":   new firebase.firestore.GeoPoint(latitude, longitude),
  "rooms": [ 
    {
      "gender": 0,    // 0: women, 1: men, 2: not specified
      "people": 2,    // how many people per room
      "price":  6000, // how much money per person
      "type":   1     // 0: rent by bed, 1: rent by room
    }
  ],
  "title": "" // the house name
}
```

## What's Missing
To build the site, you need to get your [Firebase configuration](https://firebase.google.com/docs/web/setup)
and [Google Maps API key](developers.google.com/maps/documentation/javascript/get-api-key).