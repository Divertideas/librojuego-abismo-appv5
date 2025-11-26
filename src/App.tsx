import React, { useState, useMemo } from "react";

// -------------------- Datos base --------------------
const BASE_STATS = ["fuerza", "habilidad", "conocimiento", "observacion"] as const;
type StatKey = typeof BASE_STATS[number];

type CharacterDef = {
  id: "detective" | "bibliotecaria" | "sacerdote";
  nombre: string;
  habilidad?: string;
  stats: Record<StatKey, number>;
};

type Item = {
  id: string;
  nombre: string;
  descripcion?: string;
  efectos?: Partial<Record<StatKey, number>>;
};

const PERSONAJES: CharacterDef[] = [
  {
    id: "detective",
    nombre: "Detective",
    habilidad: "Suma una pista extra cada vez que ganas pistas.",
    stats: { fuerza: 4, habilidad: 2, conocimiento: 1, observacion: 3 },
  },
  {
    id: "bibliotecaria",
    nombre: "Bibliotecaria",
    habilidad: "Puedes repetir una tirada de Conocimiento y quedarte con el mejor resultado.",
    stats: { fuerza: 1, habilidad: 1, conocimiento: 3, observacion: 3 },
  },
  {
    id: "sacerdote",
    nombre: "Sacerdote",
    habilidad: "La primera vez que tu cordura llegue a cero, tira un dado y suma el resultado.",
    stats: { fuerza: 2, habilidad: 2, conocimiento: 2, observacion: 3 },
  },
];

// Objetos seleccionables (del PDF original completo)
const ITEMS_DB: Item[] = [
  // --- Página 1 del inventario ---
  {
    id: "extractor_esencia_caotica",
    nombre: "Extractor de esencia caótica",
    descripcion: "Objeto especial (efecto narrativo).",
  },
  {
    id: "cuerno_diablillo",
    nombre: "Cuerno de diablillo",
    descripcion: "+2 a tu base de Fuerza mientras lo lleves.",
    efectos: { fuerza: 2 },
    tag: "arma",
  },
  {
    id: "llave_sacrilega",
    nombre: "Llave sacrílega",
    descripcion: "Objeto especial (efecto narrativo).",
  },
  {
    id: "pocion_treboles",
    nombre: "Poción de tréboles",
    descripcion: "Superas automáticamente cualquier tirada. Se descarta tras usarla.",
    tag: "consumible",
  },
  {
    id: "pocion_sabiduria",
    nombre: "Poción de sabiduría",
    descripcion: "+3 a tu tirada de Conocimiento (una sola tirada). Se descarta tras usarla.",
    tag: "consumible",
  },
  {
    id: "pocion_reflejos",
    nombre: "Poción de reflejos",
    descripcion: "+3 a una tirada de Habilidad/Agilidad (una sola tirada). Se descarta tras usarla.",
    tag: "consumible",
  },
  {
    id: "elixir_fortaleza",
    nombre: "Elixir de fortaleza",
    descripcion: "Usa tu característica más alta para cualquier tirada. Se descarta tras usarlo.",
    tag: "consumible",
  },
  {
    id: "elixir_drenaje",
    nombre: "Elixir de drenaje",
    descripcion: "El objetivo de éxito se reduce a la mitad. Se descarta tras usarlo.",
    tag: "consumible",
  },
  {
    id: "llave_tentacular",
    nombre: "Llave tentacular",
    descripcion: "Objeto especial (efecto narrativo).",
  },

  // --- Página 2 del inventario ---
  {
    id: "pendulo",
    nombre: "Péndulo",
    descripcion: "+2 a tu base de Observación mientras lo lleves.",
    efectos: { observacion: 2 },
  },
  {
    id: "conjuro_suerte",
    nombre: "Conjuro de suerte",
    descripcion: "Vuelve a tirar los dados. Se descarta tras usarlo.",
    tag: "consumible",
  },
  {
    id: "elixir_verde_cordura",
    nombre: "Elixir restaurador",
    descripcion: "Recupera +4 de Cordura. Se descarta tras usarlo.",
    tag: "consumible",
  },
  {
    id: "florete",
    nombre: "Florete",
    descripcion: "+2 a tu base de Fuerza mientras lo lleves.",
    efectos: { fuerza: 2 },
    tag: "arma",
  },
  {
    id: "muneco_vudu",
    nombre: "Muñeco vudú",
    descripcion: "Ganas un combate automáticamente. Se descarta tras usarlo.",
    tag: "consumible",
  },
  {
    id: "amuleto",
    nombre: "Amuleto",
    descripcion: "+1 a tu base de Conocimiento mientras lo lleves.",
    efectos: { conocimiento: 1 },
  },
  {
    id: "tijeras_podar",
    nombre: "Tijeras de podar",
    descripcion: "+1 a tu base de Fuerza mientras las lleves.",
    efectos: { fuerza: 1 },
    tag: "arma",
  },
  {
    id: "flores_jardin",
    nombre: "Flores de jardín",
    descripcion: "+3 de Cordura. Se descarta tras usarlo.",
    tag: "consumible",
  },
  {
    id: "elixir_drenaje_espiritual",
    nombre: "Elixir de drenaje espiritual",
    descripcion: "El objetivo de éxito se reduce a la mitad. Se descarta tras usarlo.",
    tag: "consumible",
  },

  // --- Página 3 del inventario ---
  {
    id: "pistola_bendecida",
    nombre: "Pistola bendecida",
    descripcion: "En ataque de Fuerza puedes volver a tirar el dado y quedarte con el NUEVO resultado.",
    tag: "arma",
  },
  {
    id: "coctel_molotov",
    nombre: "Cóctel molotov",
    descripcion: "+3 a un ataque de Fuerza. Se descarta tras usarlo.",
    tag: "consumible",
  },
  {
    id: "cuchillo",
    nombre: "Cuchillo",
    descripcion: "+1 a tu base de Fuerza mientras lo lleves.",
    efectos: { fuerza: 1 },
    tag: "arma",
  },
  {
    id: "vela",
    nombre: "Vela",
    descripcion: "+3 a tu base de Observación durante una tirada. Se descarta tras usarla.",
    tag: "consumible",
  },
  {
    id: "anillo_rapidez",
    nombre: "Anillo de rapidez",
    descripcion: "+1 a tu base de Habilidad/Agilidad mientras lo lleves.",
    efectos: { habilidad: 1 },
  },
  {
    id: "elixir_intercambio",
    nombre: "Elixir de intercambio",
    descripcion: "Intercambia qué característica usas para una tirada (p.ej., usar Fuerza en lugar de Habilidad). Se descarta tras usarlo.",
    tag: "consumible",
  },
  {
    id: "farol",
    nombre: "Farol",
    descripcion: "+1 pista EXTRA cada vez que ese personaje gana pistas (pasivo mientras lo lleves).",
  },
  {
    id: "grimorio",
    nombre: "Grimorio",
    descripcion: "En una prueba de Conocimiento puedes volver a tirar y DEBES quedarte con el nuevo resultado.",
  },
];

// -------------------- Tipos --------------------
type InvestigatorState = {
  id: string;
  base: Record<StatKey, number>;
  mods: Record<StatKey, number>;
  inv: string[];
  cordura: number;
  pistas: number;
};

function empty(): InvestigatorState {
  return {
    id: "",
    base: { fuerza: 0, habilidad: 0, conocimiento: 0, observacion: 0 },
    mods: { fuerza: 0, habilidad: 0, conocimiento: 0, observacion: 0 },
    inv: [],
    cordura: 10,
    pistas: 0,
  };
}

function computeItemMods(ids: string[]) {
  const acc = { fuerza: 0, habilidad: 0, conocimiento: 0, observacion: 0 };
  for (const id of ids) {
    const it = ITEMS_DB.find((x) => x.id === id);
    if (!it?.efectos) continue;
    for (const k of Object.keys(it.efectos) as StatKey[]) {
      acc[k] += it.efectos[k] || 0;
    }
  }
  return acc;
}

function totalStats(base: any, mods: any, items: any) {
  const out: any = {};
  for (const k of BASE_STATS) out[k] = Math.max(0, base[k] + mods[k] + items[k]);
  return out;
}

// -------------------- APP PRINCIPAL --------------------
export default function App() {
  const [teamSize, setTeamSize] = useState<1 | 2>(1);
  const [party, setParty] = useState([empty()]);
  const [fragmentos, setFragmentos] = useState(0);

  const [caras, setCaras] = useState(6);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [prev, setPrev] = useState<number | null>(null);

  // ----- Set personaje -----
  function setCharacter(slot: 0 | 1, id: string) {
    const p = [...party];
    const def = PERSONAJES.find((x) => x.id === id);

    if (!def) {
      p[slot] = empty();
    } else {
      p[slot] = {
        id,
        base: { ...def.stats },
        mods: { fuerza: 0, habilidad: 0, conocimiento: 0, observacion: 0 },
        inv: [],
        cordura: 10,
        pistas: id === "bibliotecaria" ? 4 : 0,
      };
    }

    setParty(p);
  }

  // ----- Añadir / quitar objetos -----
  function addItem(slot: 0 | 1, id: string) {
    const p = [...party];
    p[slot].inv = Array.from(new Set([...p[slot].inv, id]));
    setParty(p);
  }

  function removeItem(slot: 0 | 1, id: string) {
    const p = [...party];
    p[slot].inv = p[slot].inv.filter((x) => x !== id);
    setParty(p);
  }

  // ----- Ajuste de mods -----
  function adjustMod(slot: 0 | 1, stat: StatKey, delta: 1 | -1) {
    const p = [...party];
    p[slot].mods[stat] += delta;
    setParty(p);
  }

  // ----- Dado -----
  async function roll() {
    setRolling(true);
    setPrev(result);
    setResult(null);
    await new Promise((r) => setTimeout(r, 600));
    const final = 1 + Math.floor(Math.random() * caras);
    setResult(final);
    setRolling(false);
  }

  // -------------------- Render --------------------
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">Panel del Investigador</h1>
          <button className="btn-secondary" onClick={() => window.location.reload()}>
            Reiniciar
          </button>
        </div>
      </header>

      <main className="app-main">

        {/* Equipo */}
        <section className="panel">
          <h2 className="panel-title">Equipo</h2>
          <div className="row">
            <label className="radio">
              <input type="radio" checked={teamSize === 1} onChange={() => { setTeamSize(1); setParty([party[0]]); }} />
              1 personaje
            </label>

            <label className="radio">
              <input type="radio" checked={teamSize === 2} onChange={() => { setTeamSize(2); setParty([party[0], party[1] || empty()]); }} />
              2 personajes
            </label>
          </div>
        </section>

        {/* Selectores */}
        <section className="panel">
          <h2 className="panel-title">Selecciona personaje</h2>

          <div className="vstack">
            <div>
              <label className="label">Personaje A</label>
              <select className="input" value={party[0].id} onChange={(e) => setCharacter(0, e.target.value)}>
                <option value="">— Selecciona —</option>
                {PERSONAJES.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>

            {teamSize === 2 && (
              <div>
                <label className="label">Personaje B</label>
                <select className="input" value={party[1]?.id ?? ""} onChange={(e) => setCharacter(1, e.target.value)}>
                  <option value="">— Selecciona —</option>
                  {PERSONAJES.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
            )}
          </div>
        </section>

        {/* Fragmentos */}
        <section className="panel">
          <h2 className="panel-title">Fragmentos globales</h2>
          <div className="row">
            <button className="btn" onClick={() => setFragmentos((v) => Math.max(0, v - 1))}>−</button>
            <span className="value">{fragmentos}</span>
            <button className="btn" onClick={() => setFragmentos((v) => v + 1)}>+</button>
          </div>
        </section>

        {/* Dado */}
        <section className="panel">
          <h2 className="panel-title">Dado</h2>

          <div className="dice-row">
            <div>
              <label className="label">Caras</label>
              <input type="number" className="input small" value={caras} min={2} onChange={(e) => setCaras(Math.max(2, Number(e.target.value)))} />
            </div>

            <button className="btn-primary" disabled={rolling} onClick={roll}>
              {rolling ? "…" : "Lanzar"}
            </button>

            <div className="dice-display">
              <div className={`dice ${rolling ? "rolling" : ""}`}>{result ?? "–"}</div>

              <div className="dice-history">
                <div className="small-text">Últ</div>
                <div className="dice-last">{result ?? "—"}</div>
                <div className="small-text">Ant: {prev ?? "—"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tarjetas */}
        {party.slice(0, teamSize).map((p, idx) => {
          const def = PERSONAJES.find((x) => x.id === p.id);
          const items = computeItemMods(p.inv);
          const totals = totalStats(p.base, p.mods, items);

          if (!def) {
            return (
              <section key={idx} className="panel card">
                <div className="placeholder">Selecciona el personaje {idx === 0 ? "A" : "B"}</div>
              </section>
            );
          }

          return (
            <section key={idx} className="panel card">

              <h3 className="card-title">
                {def.nombre} <span className="tag">{idx === 0 ? "A" : "B"}</span>
              </h3>

              <div className="subpanel">
                <h4>Atributos</h4>
                <p className="skill"><strong>Habilidad:</strong> {def.habilidad}</p>

                {BASE_STATS.map((k) => (
                  <div key={k} className="stat-row">
                    <span className="stat-label">{k}</span>

                    <span className="stat-info">
                      base {p.base[k]}
                      {items[k] !== 0 && <span className="mod">(obj {items[k]})</span>}
                      {p.mods[k] !== 0 && <span className="mod">(mod {p.mods[k]})</span>}
                    </span>

                    <div className="stat-buttons">
                      <button className="btn sm" onClick={() => adjustMod(idx as 0 | 1, k, -1)}>−</button>
                      <span className="value big">{totals[k]}</span>
                      <button className="btn sm" onClick={() => adjustMod(idx as 0 | 1, k, +1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="subpanel">
                <h4>Recursos</h4>

                <div className="resource-row">
                  <span>Cordura</span>
                  <div className="stat-buttons">
                    <button className="btn sm" onClick={() => { const p2 = [...party]; p2[idx].cordura--; setParty(p2); }}>−</button>
                    <span className="value big">{p.cordura}</span>
                    <button className="btn sm" onClick={() => { const p2 = [...party]; p2[idx].cordura++; setParty(p2); }}>+</button>
                  </div>
                </div>

                <div className="resource-row">
                  <span>Pistas</span>
                  <div className="stat-buttons">
                    <button className="btn sm" onClick={() => { const p2 = [...party]; p2[idx].pistas--; setParty(p2); }}>−</button>
                    <span className="value big">{p.pistas}</span>
                    <button className="btn sm" onClick={() => { const p2 = [...party]; p2[idx].pistas++; setParty(p2); }}>+</button>
                  </div>
                </div>
              </div>

              {/* Inventario */}
              <div className="subpanel">
                <h4>Inventario</h4>

                {p.inv.map((id) => {
                  const it = ITEMS_DB.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="item-row">
                      <div className="item-info">
                        <div className="item-title">{it.nombre}</div>
                        <div className="item-desc">{it.descripcion}</div>
                      </div>
                      <button className="btn-secondary sm" onClick={() => removeItem(idx as 0 | 1, id)}>
                        Quitar
                      </button>
                    </div>
                  );
                })}

                <select className="input" onChange={(e) => e.target.value && addItem(idx as 0 | 1, e.target.value)}>
                  <option value="">Añadir objeto…</option>
                  {ITEMS_DB.map((it) => (
                    <option key={it.id} value={it.id}>{it.nombre}</option>
                  ))}
                </select>
              </div>

            </section>
          );
        })}

      </main>

      <footer className="footer">Optimizado para móvil — Estilo Lovecraft Techno</footer>
    </div>
  );
}
