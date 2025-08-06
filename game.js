const rooms = {
  forest: {
    name: "Forest Clearing",
    description: "You stand in a quiet forest clearing. Birds chirp above.",
    exits: { n: "hill", e: "stream", s: "swamp" }
  },
  hill: {
    name: "Grassy Hill",
    description: "From atop the hill, you see the forest below and a path east.",
    exits: { s: "forest", e: "tower" }
  },
  stream: {
    name: "Trickling Stream",
    description: "A narrow stream flows south. You hear frogs nearby.",
    exits: { w: "forest", s: "bridge" }
  },
  swamp: {
    name: "Murky Swamp",
    description: "The ground squelches with every step. Mist coils in the air.",
    exits: { n: "forest", e: "bridge", s: "ruins" }
  },
  tower: {
    name: "Watchtower",
    description: "You climb a crumbling tower. Wind whistles through cracks.",
    exits: { w: "hill", s: "bridge" }
  },
  bridge: {
    name: "Wooden Bridge",
    description: "A rickety bridge crosses the water. It sways gently.",
    exits: { n: "stream", w: "swamp", e: "cabin", s: "cave", nw: "tower" }
  },
  cabin: {
    name: "Old Cabin",
    description: "A cozy old cabin with a broken lock and dusty windows.",
    exits: { w: "bridge" }
  },
  cave: {
    name: "Dark Cave",
    description: "It’s dark and cold. Water drips from above.",
    exits: { n: "bridge", s: "gate" }
  },
  ruins: {
    name: "Ancient Ruins",
    description: "Moss-covered stones hint at a forgotten civilization.",
    exits: { n: "swamp", e: "gate" }
  },
  gate: {
    name: "Iron Gate",
    description: "An ancient iron gate blocks the path beyond.",
    exits: { n: "cave", w: "ruins" }
  }
};

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

updateRoom();
