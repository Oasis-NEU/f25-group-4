import React, { useState, useRef } from "react";

const MenuPage = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    age: "",
    weight: "",
    favoriteFood: "",
    imageFile: null, 
  });
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imageFile: file });
    }
  };

  const handleAddPet = (e) => {
    e.preventDefault();
    const { name, role, age, weight, favoriteFood, imageFile } = form;

    if (!name || !role || !age || !weight || !imageFile) {
      alert("Please fill out all required fields and upload an image");
      return;
    }

    const imageURL = URL.createObjectURL(imageFile); // temporary local preview

    const newPet = {
      id: Date.now(),
      name,
      role,
      age,
      weight,
      favoriteFood,
      image: imageURL,
      menu: [],
    };

    setPets((prev) => [...prev, newPet]);
    setForm({
      name: "",
      role: "",
      age: "",
      weight: "",
      favoriteFood: "",
      imageFile: null,
    });

    if (pets.length === 0) setSelectedPet(newPet);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1>🐾 Pet Menu Selector</h1>
      </header>

      {/* Add Pet Form */}
      <section style={styles.formSection}>
        <h2 style={styles.formTitle}>Add a Pet Profile</h2>
        <form onSubmit={handleAddPet} style={styles.form}>
          <input
            type="text"
            placeholder="Pet Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Pet Type (e.g., Golden Retriever)"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Age (years)"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Weight (lbs)"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Favorite Food (optional)"
            value={form.favoriteFood}
            onChange={(e) => setForm({ ...form, favoriteFood: e.target.value })}
            style={styles.input}
          />

          {/* Image Upload */}
          <label style={styles.uploadLabel}>
            Upload Pet Picture:
            <input type="file" accept="image/*" onChange={handleFileUpload} style={styles.fileInput} />
          </label>

          {form.imageFile && (
            <img
              src={URL.createObjectURL(form.imageFile)}
              alt="preview"
              style={styles.previewImage}
            />
          )}

          <button type="submit" style={styles.addButton}>
            Add Pet
          </button>
        </form>
      </section>

      {/* Pet Carousel */}
      <section style={styles.carouselSection}>
        {pets.length > 0 ? (
          <>
            <button style={{ ...styles.arrow, left: "20px" }} onClick={() => scroll("left")}>
              ◀
            </button>

            <div ref={carouselRef} style={styles.carousel}>
              {pets.map((p) => (
                <div
                  key={p.id}
                  style={{
                    ...styles.petCard,
                    transform: selectedPet?.id === p.id ? "scale(1.1)" : "scale(1)",
                    opacity: selectedPet?.id === p.id ? 1 : 0.7,
                    borderColor: selectedPet?.id === p.id ? "#3b82f6" : "transparent",
                  }}
                  onClick={() => setSelectedPet(p)}
                >
                  <img src={p.image} alt={p.name} style={styles.petImage} />
                  <h3 style={styles.petName}>{p.name}</h3>
                  <p style={styles.petRole}>{p.role}</p>
                  <p style={styles.petDetails}>
                    Age: {p.age} | {p.weight} lbs
                  </p>
                  {p.favoriteFood && <p style={styles.petFavorite}>🍖 {p.favoriteFood}</p>}
                </div>
              ))}
            </div>

            <button style={{ ...styles.arrow, right: "20px" }} onClick={() => scroll("right")}>
              ▶
            </button>
          </>
        ) : (
          <p style={styles.noPetsText}>No pets yet. Add one above to get started!</p>
        )}
      </section>

      {/* Selected Pet Details */}
      {selectedPet && (
        <main style={styles.menuSection}>
          <h2 style={styles.menuTitle}>{selectedPet.name}’s Profile</h2>
          <div style={styles.profileCard}>
            <img src={selectedPet.image} alt={selectedPet.name} style={styles.profileImage} />
            <div style={styles.profileDetails}>
              <p><strong>Type:</strong> {selectedPet.role}</p>
              <p><strong>Age:</strong> {selectedPet.age} years</p>
              <p><strong>Weight:</strong> {selectedPet.weight} lbs</p>
              {selectedPet.favoriteFood && (
                <p><strong>Favorite Food:</strong> {selectedPet.favoriteFood}</p>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} Pet Menu Selector
      </footer>
    </div>
  );
};

// 🧭 Inline Styles
const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    color: "#333",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "white",
    padding: "16px 24px",
    fontSize: "1.6rem",
    fontWeight: "bold",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  formSection: {
    textAlign: "center",
    padding: "30px 0",
  },
  formTitle: {
    fontSize: "1.5rem",
    marginBottom: "16px",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  input: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    minWidth: "180px",
  },
  uploadLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "10px",
    fontSize: "1rem",
    color: "#444",
  },
  fileInput: {
    marginTop: "6px",
  },
  previewImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "50%",
    marginTop: "10px",
  },
  addButton: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  carouselSection: {
    position: "relative",
    background: "linear-gradient(to right, #dbeafe, #eff6ff)",
    padding: "40px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    minHeight: "240px",
  },
  noPetsText: { color: "#555", fontSize: "1rem" },
  carousel: {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    scrollBehavior: "smooth",
    gap: "24px",
    width: "80%",
    padding: "0 80px",
  },
  petCard: {
    flexShrink: 0,
    width: "180px",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.3s, opacity 0.3s, border-color 0.3s",
    border: "4px solid transparent",
    borderRadius: "12px",
    padding: "10px",
    background: "white",
  },
  petImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "8px",
  },
  petName: { fontWeight: "bold" },
  petRole: { color: "#666", fontSize: "0.9rem" },
  petDetails: { color: "#555", fontSize: "0.85rem" },
  petFavorite: { color: "#3b82f6", fontSize: "0.9rem", marginTop: "4px" },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "white",
    border: "none",
    borderRadius: "50%",
    padding: "10px 14px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    fontSize: "1.2rem",
    zIndex: 2,
  },
  menuSection: { flex: 1, textAlign: "center", padding: "40px" },
  menuTitle: { fontSize: "2rem", marginBottom: "16px" },
  profileCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    background: "white",
    padding: "20px 30px",
    borderRadius: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  profileImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  profileDetails: { textAlign: "left", fontSize: "1rem", color: "#333" },
  footer: {
    textAlign: "center",
    padding: "16px",
    borderTop: "1px solid #ddd",
    color: "#666",
  },
};

export default MenuPage;