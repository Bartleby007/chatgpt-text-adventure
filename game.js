let rooms = {};
let items = {};
let currentRoom = "Circle-of-Light"; // starting room
let inventory = [];

// Load both rooms and items
Promise.all([
  fetch("rooms.json").then(res => res.json()),
  fetch("items.json").then(res => res.json())
])
.then(([roomsData, itemsData]) => {
  rooms = roomsData;
  items = itemsData;
  updateRoom();
})
.catch(err => {
  document.getElementById("room-description").textContent = "Failed to load game data.";
  console.error(err);
});

function updateRoom() {
  const room = rooms[currentRoom];
  if (!room) {
    document.getElementById("room-description").textContent = `Room "${currentRoom}" not found.`;
    return;
  }

  document.getElementById("room-description").textContent = `${room.name}: ${room.description}`;

  // Show movement buttons
  const directions = ["n","ne","e","se","s","sw","w","nw","u","d"];
  directions.forEach(dir => {
    const btn = document.getElementById(`btn-${dir}`);
    if (room.exits && room.exits[dir]) {
      btn.disabled = false;
      btn.onclick = () => {
        currentRoom = room.exits[dir];
        updateRoom();
      };
    } else {
      btn.disabled = true;
      btn.onclick = null;
    }
  });

  // Show items in current room
  const itemsHere = Object.entries(items)
    .filter(([id, item]) => item.location === currentRoom)
    .map(([id, item]) => ({ id, ...item }));

  const itemsContainer = document.getElementById("items");
  if (itemsHere.length > 0) {
    itemsContainer.innerHTML = itemsHere.map(item =>
      `${item.name} - ${item.description} <button onclick="takeItem('${item.id}')">Take</button>`
    ).join("<br>");
  } else {
    itemsContainer.innerHTML = "";
  }

  // Update inventory display
  document.getElementById("inventory").textContent = `Inventory: ${inventory.map(i => i.name).join(", ") || "Empty"}`;
}

function takeItem(itemId) {
  if (items[itemId] && items[itemId].location === currentRoom) {
    inventory.push({ id: itemId, name: items[itemId].name, description: items[itemId].description });
    items[itemId].location = "inventory";
    updateRoom();
  }
}
