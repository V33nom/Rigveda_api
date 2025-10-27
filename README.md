# 🔱 Rigveda Insights API  
### _Explore the ancient wisdom of the Rigveda through modern technology._

**Rigveda Insights API** is an open-source RESTful API designed to make the hymns, deities, and spiritual concepts of the Rigveda accessible to developers, researchers, and educators.  
It brings ancient Sanskrit texts into a structured digital form that can be integrated into modern apps, dashboards, or storytelling platforms.

---

## 🌍 Overview
The **Rigveda Insights API** allows users to explore the sacred hymns, deities, and philosophical ideas of the Rigveda.  
Each hymn is connected with its related deity, themes, and verses, forming an interconnected web of Vedic knowledge.

This API powers **RitVerse**, a project dedicated to digitally preserving ancient Indian texts through visualization, narration, and storytelling.

---

## ⚙️ Features
✅ **Retrieve Rigvedic Hymns:** Access detailed hymn data with deities, meanings, and translations.  
✅ **Deity Graph Endpoint:** Visualize relationships between deities and hymns as a network.  
✅ **Smart Search:** Filter verses by deity name, theme, or verse number.  
✅ **Structured JSON Format:** Developer-friendly schema for clean integrations.  
✅ **Educational Focus:** Built for researchers, spiritual learners, and kids-friendly storytelling apps.

---

## 🔗 Example Endpoints

| Method | Endpoint | Description |
|:------:|-----------|-------------|
| `GET` | `/api/hymns` | Get all hymns with metadata |
| `GET` | `/api/hymns/:id` | Fetch specific hymn details |
| `GET` | `/api/hymns/deity/:name` | Get hymns related to a deity |
| `GET` | `/api/hymns/deity-graph` | Return graph data for deity-hymn relationships |
| `GET` | `/api/hymns/themes/:name` | Retrieve hymns related to a theme |
| `GET` | `/api/hymns/search?q=Agni` | Search hymns by deity, keyword, or theme |

---

## 🧠 Example Response

```json
{
  "id": "RV_1_1",
  "mandala": 1,
  "hymn": 1,
  "verse": 1,
  "deities": ["Agni"],
  "sanskrit": "अग्निमीळे पुरोहितं...",
  "translation": "I praise Agni, the chosen priest...",
  "themes": ["Light", "Wisdom", "Sacrifice"],
  "explanation": "Agni represents divine illumination and the messenger between humans and gods."
}

