function displayedPrice(rooms) {
  let single = document.getElementById("single").checked,
      out  = [];
  
  if (!single) {
    out = rooms.filter(room => room.people > 1);
  } else {
    out = rooms;
  }

  let total = out.map(room => room.people * room.price)
                   .reduce((x, y) => x + y),
      num = out.map(room => room.people)
                 .reduce((x, y) => x + y);
  return total / num;
}

function newGeoPoint(house) {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        house.location.longitude,
        house.location.latitude
      ],
    },
    properties: {
      company: house.company.id,
      address: house.address,
      price:   displayedPrice(house.rooms),
      rooms:   house.rooms
    }
  }
}

function updateMap(e) {
  let checked = e.target.checked,
      company = e.target.id;
  
  if (checked) {
    houses.where("company", "==", companies.doc(company))
    .get()
    .then(houses => {
      houses.forEach(house => {
        let point = newGeoPoint(house.data());
        map.data.addGeoJson(point);
      });
    })
    .catch(err => console.error(err));
    return
  }

  // remove unchecked company
  map.data.forEach(feature => {
    if (feature.getProperty("company") == company) map.data.remove(feature);
  });
}

function newCheckbox(id, name) {
  let block    = document.createElement("div"),
      checkbox = document.createElement("input"),
      label    = document.createElement("label"),
      panel    = document.getElementById("panel");

  checkbox.type = "checkbox";
  checkbox.name = id;
  checkbox.id   = id;
  checkbox.onchange = updateMap;
  checkbox.classList.add("sharehouse");

  label.setAttribute("for", id);
  label.innerText = name;

  block.appendChild(checkbox);
  block.appendChild(label);
  panel.appendChild(block);
}

function initPanel() {
  companies.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        newCheckbox(doc.id, doc.data().name);
      })
    })
    .catch(err => console.error(err));
}

function updateSingle() {
  map.data.forEach(feature => {
    let rooms = feature.getProperty("rooms");
    feature.setProperty("price", displayedPrice(rooms));
  });
}

function interpolateHsl(lowHsl, highHsl, fraction) {
  var color = [];
  for (var i = 0; i < 3; i++) {
    // Calculate color based on the fraction.
    color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
  }

  return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
}

function styleFeature(feature) {
  let low   = [151, 83, 34],
      high  = [5, 69, 54],
      frac  = (feature.getProperty('price') - 6000) / 6000,
      color = interpolateHsl(low, high, frac);

  return {
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 16,
      strokeWeight: 0,
      strokeColor: '#fff',
      fillColor: color,
      fillOpacity: 0.5
    }
  };
}