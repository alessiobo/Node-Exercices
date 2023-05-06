const pgp = require("pg-promise")();
const db = pgp(process.env.DATABASE_URL || "postgres://localhost:5432/mydb");

const getAllPlanets = async (req, res) => {
  try {
    const planets = await db.any("SELECT * FROM planets");
    res.json(planets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPlanetById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const planet = await db.one("SELECT * FROM planets WHERE id = $1", id);
    res.json(planet);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Planet not found" });
  }
};

const createPlanet = async (req, res) => {
  const name = req.body.name;
  try {
    const newPlanet = await db.one(
      "INSERT INTO planets (name) VALUES ($1) RETURNING *",
      name
    );
    res.status(201).json(newPlanet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePlanet = async (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;
  try {
    const updatedPlanet = await db.one(
      "UPDATE planets SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    res.json(updatedPlanet);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Planet not found" });
  }
};

const deletePlanet = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.none("DELETE FROM planets WHERE id = $1", id);
    res.json({ message: "Planet deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Planet not found" });
  }
};

module.exports = {
  getAllPlanets,
  getPlanetById,
  createPlanet,
  updatePlanet,
  deletePlanet,
};
