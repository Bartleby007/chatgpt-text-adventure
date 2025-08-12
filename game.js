let rooms = {};
let items = {};
let useRules = [];
let currentRoom = "Circle-of-Light";
let inventory = [];
let selectedItem = null;
let roomEvents = [];

// Load all JSON data before starting game
Promise.all([
  fetch("rooms.json").then(res => res.json()),
  fetch("items.json").then(res => res.json()),
  fetch("useRules.json").then(res => res.json()),
  fetch("roomEvents.json").then(res => res.json())
])
.then(([roomData, itemData, ruleData, roomEventsData]) => {
  rooms = roomData;
  items = itemData;
  useRules = ruleData;
  roomEvents = roomEventsData;
  updateRoom();
})
.catch(err => {
  document.getElementById("room-description").innerText = "Failed to load game data.";
  console.error(err);
});

function updateRoom() {
  const room = rooms[currentRoom];
  document.getElementById("room-description").innerText = room.name + "\n" + room.description;

  // Items in current room
  const itemsHere = Object.keys(items).filter(id => items[id].location === currentRoom);
  const itemsDiv = document.getElementById("items");
  itemsDiv.innerHTML = "";
  if (itemsHere.length > 0) {
    itemsHere.forEach(id => {
      const btn = document.createElement("button");
      btn.innerText = items[id].name;
      btn.onclick = () => pickUpItem(id);
      itemsDiv.appendChild(btn);
    });
  } else {
    itemsDiv.innerHTML = "<em>No items here.</em>";
  }

  // Navigation buttons
  const directions = ["n","ne","e","se","s","sw","w","nw","u","d"];
  directions.forEach(dir => {
    const btn = document.getElementById(`btn-${dir}`);
    if (room.exits && room.exits[dir]) {
      btn.disabled = false;
      btn.onclick = () => moveToRoom(room.exits[dir]);
    } else {
      btn.disabled = true;
      btn.onclick = null;
    }
  });

  // Inventory display
  const invDiv = document.getElementById("inventory");
  invDiv.innerHTML = "";
  if (inventory.length > 0) {
    inventory.forEach(id => {
      const btn = document.createElement("button");
      btn.innerText = items[id].name;
      btn.onclick = () => selectItem(id);
      invDiv.appendChild(btn);
    });
  } else {
    invDiv.innerText = "Inventory: Empty";
  }

  // Hide item actions if nothing selected
  if (!selectedItem) {
    document.getElementById("item-actions").style.display = "none";
  }
}

function moveToRoom(roomId) {
  selectedItem = null; // deselect any item
  document.getElementById("info-panel").innerText = "No new information."; // reset here only
  currentRoom = roomId;
  updateRoom();
  
  // Check for passive room events
  roomEvents.forEach(event => {
    if (event.roomId === currentRoom) {
      let conditionMet = true;
      if (event.condition && event.condition.hasItem) {
        conditionMet = inventory.includes(event.condition.hasItem);
      }
      if (conditionMet) {
        document.getElementById("info-panel").innerText = event.text;
      }
    }
  });
}

function pickUpItem(itemId) {
  items[itemId].location = "inventory";
  inventory.push(itemId);
  updateRoom();
}

function selectItem(itemId) {
  selectedItem = itemId;
  document.getElementById("item-actions").style.display = "block";

  // Assign actions
  document.getElementById("action-use").onclick = () => useItem(itemId);
  document.getElementById("action-drop").onclick = () => dropItem(itemId);
  document.getElementById("action-inspect").onclick = () => inspectItem(itemId);
}

function useItem(itemId) {
  let rule = useRules.find(r => r.itemId === itemId && r.roomId === currentRoom);

  // If no exact match, check for default rule
  if (!rule) {
    rule = useRules.find(r => r.itemId === itemId && r.default);
  }

  if (rule) {
    document.getElementById("info-panel").innerText = rule.text;

    if (rule.effect) {
      if (rule.effect.addItem) {
        const newItem = rule.effect.addItem;
        items[newItem.id] = {
          name: newItem.name,
          description: newItem.description,
          location: newItem.location,
          singleUse: newItem.singleUse || false
        };
      }
      if (rule.effect.moveItem) {
        const moveId = rule.effect.moveItem.id;
        
        // Only move if it's currently in the Inventory-Hold
        if (items[moveId].location === "Inventory-Hold") {
          items[moveId].location = rule.effect.moveItem.location;
        }
      }
      if (rule.effect.removeItemFromInventory) {
        inventory = inventory.filter(id => id !== itemId);
        delete items[itemId];
      }
    }
  } else {
    document.getElementById("info-panel").innerText = "Nothing happens.";
  }

  selectedItem = null;
  document.getElementById("item-actions").style.display = "none";
  updateRoom();
}


function dropItem(itemId) {
  items[itemId].location = currentRoom;
  inventory = inventory.filter(id => id !== itemId);
  document.getElementById("info-panel").innerText = `You dropped the ${items[itemId].name}.`;
  selectedItem = null; // hide menu after action
  document.getElementById("item-actions").style.display = "none";
  updateRoom();
}

function inspectItem(itemId) {
  document.getElementById("info-panel").innerText = items[itemId].description;
  selectedItem = null;
  document.getElementById("item-actions").style.display = "none";
  updateRoom(); // now won't overwrite info panel
}
