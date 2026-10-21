import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");

// In-memory cache for ultra-fast response with disk persistence
const cache = new Map();

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

/** Atomic file write */
async function writeToDisk(collection, data) {
  await ensureDataDir();
  const filePath = getFilePath(collection);
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  const serialized = JSON.stringify(data, null, 2);
  await fs.writeFile(tempPath, serialized, "utf8");
  await fs.rename(tempPath, filePath);
}

/** Read from disk */
async function readFromDisk(collection, defaultValue = null) {
  await ensureDataDir();
  const filePath = getFilePath(collection);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") {
      if (defaultValue !== null) {
        await writeToDisk(collection, defaultValue);
        return defaultValue;
      }
      return null;
    }
    throw err;
  }
}

export const db = {
  async init() {
    await ensureDataDir();

    // Known collections
    const collections = [
      { name: "users", default: [] },
      { name: "developer", default: {} },
      { name: "about", default: {} },
      { name: "skills", default: [] },
      { name: "projects", default: [] },
      { name: "experience", default: [] },
      { name: "sections", default: [] },
      { name: "forms", default: [] },
      { name: "submissions", default: [] },
      { name: "messages", default: [] },
    ];

    for (const col of collections) {
      const data = await readFromDisk(col.name, col.default);
      cache.set(col.name, data);
    }

    console.log("Persistent Database initialized directly from disk storage.");
  },

  async get(collection) {
    if (cache.has(collection)) {
      return cache.get(collection);
    }
    const data = await readFromDisk(collection, []);
    cache.set(collection, data);
    return data;
  },

  async set(collection, data) {
    cache.set(collection, data);
    await writeToDisk(collection, data);
    return data;
  },

  async findById(collection, id) {
    const list = await this.get(collection);
    if (!Array.isArray(list)) return null;
    return list.find((item) => String(item.id) === String(id)) || null;
  },

  async insert(collection, item) {
    const list = await this.get(collection);
    if (!Array.isArray(list)) {
      throw new Error(`Collection ${collection} is not an array`);
    }
    const newItem = {
      id: item.id || `${collection.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item,
    };
    list.push(newItem);
    await this.set(collection, list);
    return newItem;
  },

  async update(collection, id, updates) {
    const list = await this.get(collection);
    if (!Array.isArray(list)) {
      throw new Error(`Collection ${collection} is not an array`);
    }
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      id: list[index].id, // preserve id
      updatedAt: new Date().toISOString(),
    };
    await this.set(collection, list);
    return list[index];
  },

  async remove(collection, id) {
    const list = await this.get(collection);
    if (!Array.isArray(list)) {
      throw new Error(`Collection ${collection} is not an array`);
    }
    const filtered = list.filter((item) => String(item.id) !== String(id));
    const wasRemoved = filtered.length !== list.length;
    if (wasRemoved) {
      await this.set(collection, filtered);
    }
    return wasRemoved;
  },
};
