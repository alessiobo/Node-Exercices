const express = require("express");
const router = express.Router();
const Joi = require("joi");

let planets = [
  { id: 1, name: "Mercury" },
  { id: 2, name: "Venus" },
  { id: 3, name: "Earth" },
  { id: 4, name: "Mars" },
  { id: 5, name: "Jupiter" },
  { id: 6, name: "Saturn" },
  { id: 7, name: "Uranus" },
  { id: 8, name: "Neptune" },
  { id: 9, name: "Pluto" },
];

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

// GET /api/planets
router.get("/", (req, res) => {
  res.status(200).json(planets);
});

// GET /api/planets/:id
router.get("/:id", (req, res) => {
  const planet = planets.find((p) => p.id === parseInt(req.params.id));
  if (!planet) {
    return res.status(404).send("Planet not found");
  }
  res.status(200).json(planet);
});

// POST /api/planets
router.post("/", (req, res) => {
  const { error } = planetSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const planet = {
    id: planets.length + 1,
    name: req.body.name,
  };
  planets.push(planet);
  res.status(201).json({ msg: "Planet created successfully" });
});

// PUT /api/planets/:id
router.put("/:id", (req, res) => {
  const planet = planets.find((p) => p.id === parseInt(req.params.id));
  if (!planet) {
    return res.status(404).send("Planet not found");
  }
  const { error } = planetSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  planet.name = req.body.name;
  res.status(200).json({ msg: "Planet updated successfully" });
});

// DELETE /api/planets/:id
router.delete("/:id", (req, res) => {
  const planetIndex = planets.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );
  if (planetIndex === -1) {
    return res.status(404).send("Planet not found");
  }
  planets.splice(planetIndex, 1);
  res.status(200).json({ msg: "Planet deleted successfully" });
});

module.exports = router;
