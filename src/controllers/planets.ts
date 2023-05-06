import { Request, Response } from "express";
import Joi from "joi";

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

export const getAll = (req: Request, res: Response) => {
  res.status(200).json(planets);
};

export const getOneById = (req: Request, res: Response) => {
  const planet = planets.find((p) => p.id === parseInt(req.params.id));
  if (!planet) return res.status(404).send("Planet not found");
  res.status(200).json(planet);
};

export const create = (req: Request, res: Response) => {
  const { error } = planetSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const planet = {
    id: planets.length + 1,
    name: req.body.name,
  };
  planets = [...planets, planet];

  res.status(201).json({ msg: "Planet created successfully" });
};

export const updateById = (req: Request, res: Response) => {
  const planet = planets.find((p) => p.id === parseInt(req.params.id));
  if (!planet) return res.status(404).send("Planet not found");

  const { error } = planetSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  planet.name = req.body.name;

  planets = planets.map((p) => (p.id === planet.id ? planet : p));

  res.status(200).json({ msg: "Planet updated successfully" });
};

export const deleteById = (req: Request, res: Response) => {
  const planetIndex = planets.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );
  if (planetIndex === -1) return res.status(404).send("Planet not found");

  planets = planets.filter((p) => p.id !== parseInt(req.params.id));

  res.status(200).json({ msg: "Planet deleted successfully" });
};
