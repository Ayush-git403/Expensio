const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { userId: req.user.id };

    if (month && year) {
      // specific month + year
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end   = new Date(Number(year), Number(month), 1);
      query.date  = { $gte: start, $lt: end };

    } else if (year) {
      // whole year only
      const start = new Date(Number(year), 0, 1);   // Jan 1
      const end   = new Date(Number(year) + 1, 0, 1); // Jan 1 next year
      query.date  = { $gte: start, $lt: end };
    }

    console.log('Query:', JSON.stringify(query)); // ← debug log
    console.log('Year param received:', year);    // ← debug log

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  const { name, amount, category, date, note } = req.body;
  try {
    const expense = await Expense.create({
      userId: req.user.id,
      name, amount, category, date, note
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    const updated = await Expense.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;