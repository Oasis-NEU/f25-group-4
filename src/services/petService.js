import pet1 from "../assets/pet1.jpg";

const KEY = "pet-health:pets";

function seed() {
  const exists = localStorage.getItem(KEY);
  if (exists) return JSON.parse(exists);
  const data = {
    byId: {
      "pet-1": {
        id: "pet-1",
        name: "Mochi",
        species: "dog",
        gender: "female",
        breed: "Maltese",
        birthday: "2022-05-10",
        weightKg: 8.2,
        vaccinated: true,
        intro: "Loves sunny naps and belly rubs.",
        avatar:pet1,
        ownerEmail: "demo@example.com",
      },
    },
    allIds: ["pet-1"],
  };
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

function readAll() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : seed();
}
function writeAll(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export async function getPet(petId = "pet-1") {
  const db = readAll();
  return db.byId[petId] || null;
}

export async function updatePet(petId, patch) {
  const db = readAll();
  db.byId[petId] = { ...(db.byId[petId] || { id: petId }), ...patch };
  if (!db.allIds.includes(petId)) db.allIds.push(petId);
  writeAll(db);
  return db.byId[petId];
}
