const express = require('express');
const router = express.Router();
const Pokemon = require('../models/pokemonSchema');

router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        console.log('All Pokemons:');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET one Pokemon by ID
router.get('/:id', getPokemon, (req, res) => {
    res.json(res.pokemon);
});

// CREATE a new Pokemon
router.post('/', async (req, res) => {
    const pokemon = new Pokemon({
        Number: req.body.Number,
        Name: req.body.Name,
        Type1: req.body.Type1,
        Type2: req.body.Type2
    });

    try {
        const newPokemon = await pokemon.save();
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a Pokemon by ID
router.delete('/:id', getPokemon, async (req, res) => {
    const id = req.params.id
    
    try {
        await Pokemon.deleteOne({ _id: id });
        res.json({ message: 'Pokemon deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// EDIT/UPDATE a Pokemon by ID
router.patch('/:id', async (req, res) => {
    const { Number, Name, Type1, Type2 } = req.body;
    const id = req.params.id;

    try {
        const pokemon = await Pokemon.findById(id);

        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        // Log the original and updated Pokemon data
        console.log('Original Pokemon:', pokemon);
        console.log("data updated :",Number,Name,Type1,Type2)

        if (Number !== undefined) {
            pokemon.Number = Number;
        }
        if (Name !== undefined) {
            pokemon.Name = Name;
        }
        if (Type1 !== undefined) {
            pokemon.Type1 = Type1;
        }
        if (Type2 !== undefined) {
            pokemon.Type2 = Type2;
        }

        console.log('Updated Pokemon:', pokemon);

        const updatedPokemon = await pokemon.save();
        res.json(updatedPokemon);
    } catch (error) {
        console.error('Error updating Pokemon:', error);
        res.status(500).json({ message: 'Failed to update Pokemon' });
    }
});



router.get('/number/:number', async (req, res) => {
    const pokemonNumber = req.params.number;

    try {
        const pokemon = await Pokemon.findOne({ Number: pokemonNumber });

        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware function to fetch single Pokemon by ID
async function getPokemon(req, res, next) {
    try {
        const pokemon = await Pokemon.findById(req.params.id);
        if (pokemon == null) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }
        res.pokemon = pokemon;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = router;
