let rooms = {};
let currentRoom = "forest";

function updateRoom() {
  const room = rooms[currentRoom];
  document.getElementById("room-description").textContent = `${room.name}: ${room.description}`;

  const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
  directions.forEach(dir => {
    const btn = document.getElementById(`move-${dir}`);
    if (room.exits[dir]) {
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
}

// Load the room data from rooms.json
fetch("rooms.json")
  .then(response => {
    if (!response.ok) throw new Error("Failed to load rooms.json");
    return response.json();
  })
  .then(data => {
    rooms = data;
    updateRoom();
  })
  .catch(err => {
    document.getElementById("room-description").textContent = "Failed to load game data.";
    console.error(err);
  });
