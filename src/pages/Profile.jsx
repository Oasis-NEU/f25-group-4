import { useEffect, useMemo, useState } from "react";
import { getPet, updatePet } from "../services/petService";

const PET_ID = "pet-1";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const p = await getPet(PET_ID);
      setPet(p);
      setForm(p || {});
      setLoading(false);
    })();
  }, []);

  const ageLabel = useMemo(() => {
    if (!pet?.birthday) return "—";
    const b = new Date(pet.birthday);
    const now = new Date();
    let years = now.getFullYear() - b.getFullYear();
    let months = now.getMonth() - b.getMonth();
    if (months < 0) { years -= 1; months += 12; }
    return `${years} yr ${months} mo`;
  }, [pet?.birthday]);

  const onPickAvatar = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const onChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    if (!form.name?.trim()) return "Name is required";
    if (!form.species) return "Species is required";
    if (form.weightKg !== undefined && form.weightKg !== null) {
      const w = Number(form.weightKg);
      if (Number.isNaN(w) || w <= 0 || w > 120) return "Weight should be 0–120 kg";
    }
    if (form.birthday) {
      const d = new Date(form.birthday);
      if (isNaN(d.getTime())) return "Birthday is not a valid date";
      if (d > new Date()) return "Birthday cannot be in the future";
    }
    return "";
  };

  const save = async () => {
    const msg = validate();
    if (msg) { setError(msg); return; }
    setSaving(true);
    const updated = await updatePet(PET_ID, form);
    setPet(updated);
    setEditing(false);
    setSaving(false);
    setError("");
  };

  if (loading) return <div className="splash">Loading…</div>;

  return (
    <section className={`card profile-card ${editing ? 'editing' : ''}`}>
      <div className="card-hero">
        <div className="hero-gradient" />
        <button
          className="edit-btn"
          onClick={() => { setForm(pet); setEditing((e) => !e); setError(""); }}
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="profile-top" style={{ gridTemplateColumns: "140px 1fr" }}>
        <div className="avatar-wrap">
          {(editing ? form?.avatar : pet?.avatar) ? (
            <img
              className="avatar"
              style={{ width: 120, height: 120, borderRadius: "50%" }}
              src={editing ? form.avatar : pet.avatar}
              alt="pet avatar"
            />
          ) : (
            <div
              className="avatar placeholder"
              style={{ width: 120, height: 120, borderRadius: "50%" }}
            />
          )}
          {editing && (
            <label className="upload">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onPickAvatar(e.target.files?.[0])}
                hidden
              />
              Upload Avatar
            </label>
          )}
        </div>

        <div className="title-block" style={{ alignItems: "flex-start", textAlign: "left" }}>
          {editing ? (
            <>
              <input
                className="input title"
                placeholder="Pet name"
                value={form.name ?? ""}
                onChange={(e) => onChange("name", e.target.value)}
              />
              <input
                className="input subtitle"
                placeholder="Short intro"
                value={form.intro ?? ""}
                onChange={(e) => onChange("intro", e.target.value)}
              />
            </>
          ) : (
            <>
              <h1 className="title" style={{ marginBottom: 4 }}>Mochi</h1>
              <p className="subtitle">Loves sunny naps and belly rubs</p>
            </>
          )}
        </div>
      </div>

      <div className="grid" style={{ textAlign: "left" }}>
        <Field
          label="Age"
          read={!editing}
          value={ageLabel}
          editor={
            <input
              type="date"
              className="input"
              value={form.birthday ?? ""}
              onChange={(e) => onChange("birthday", e.target.value)}
            />
          }
          rightLabel="Weight"
          rightValue={
            editing ? (
              <input
                type="number"
                step="0.1"
                className="input"
                value={form.weightKg ?? ""}
                onChange={(e) => onChange("weightKg", e.target.value)}
              />
            ) : (pet?.weightKg ? `${pet.weightKg} kg` : "—")
          }
        />

        <Field
          label="Gender"
          read={!editing}
          value={pet?.gender || "—"}
          editor={
            <select
              className="input"
              value={form.gender ?? ""}
              onChange={(e) => onChange("gender", e.target.value)}
            >
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          }
          rightLabel="Birthday Date"
          rightValue={
            editing ? (
              <input
                type="date"
                className="input"
                value={form.birthday ?? ""}
                onChange={(e) => onChange("birthday", e.target.value)}
              />
            ) : (pet?.birthday || "—")
          }
        />

        <Field
          label="Breed"
          read={!editing}
          value={pet?.breed || "—"}
          editor={
            <input
              className="input"
              value={form.breed ?? ""}
              onChange={(e) => onChange("breed", e.target.value)}
            />
          }
          rightLabel="Vaccination Status"
          rightValue={
            editing ? (
              <select
                className="input"
                value={form.vaccinated ? "yes" : "no"}
                onChange={(e) => onChange("vaccinated", e.target.value === "yes")}
              >
                <option value="yes">Up to date</option>
                <option value="no">Not complete</option>
              </select>
            ) : (pet?.vaccinated ? "Up to date" : "Not complete")
          }
        />

        <Field
          label="Favorite Toy"
          read={!editing}
          value={pet?.favoriteToy || "Rubber Bone"}
          editor={
            <input
              className="input"
              value={form.favoriteToy ?? ""}
              onChange={(e) => onChange("favoriteToy", e.target.value)}
            />
          }
          rightLabel="Personality"
          rightValue={
            editing ? (
              <input
                className="input"
                value={form.personality ?? ""}
                onChange={(e) => onChange("personality", e.target.value)}
                placeholder="Playful, Curious"
              />
            ) : (pet?.personality || "Playful, Curious")
          }
        />
      </div>

      {error && <div className="error">{error}</div>}

      {editing && (
        <div className="actions" style={{ marginTop: "24px" }}>
          <button className="btn primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button className="btn" onClick={() => { setEditing(false); setForm(pet); }}>
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}

function Field({ label, value, read, editor, rightLabel, rightValue, hint }) {
  if (read) {
    return (
      <div className="row">
        <div className="col">
          <div className="label">{label}:</div>
          <div className="display">{value}</div>
        </div>
        <div className="col">
          <div className="label">{rightLabel}:</div>
          <div className="display">{rightValue}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="row">
      <div className="col">
        <div className="label">{label}:</div>
        {editor}
        {hint ? <div className="hint">{hint}</div> : null}
      </div>
      <div className="col">
        <div className="label">{rightLabel}:</div>
        {rightValue}
      </div>
    </div>
  );
}
