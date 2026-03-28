const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { userId: req.user.id };

    if (month && year) {
      query.$expr = {
        $and: [
          { $eq: [{ $year: '$date' }, parseInt(year)] },
          { $eq: [{ $month: '$date' }, parseInt(month)] }
        ]
      };
    } else if (year) {
      query.$expr = {
        $eq: [{ $year: '$date' }, parseInt(year)]
      };
    }

    console.log('=== EXPENSE QUERY ===');
    console.log('year:', year, '| month:', month);
    console.log('query:', JSON.stringify(query));

    const expenses = await Expense.find(query).sort({ date: -1 });

    console.log('expenses found:', expenses.length);
    console.log('====================');

    res.json(expenses);
  } catch (err) {
    console.error('Expense fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  const { name, amount, category, date, note } = req.body;
  try {
    const expense = await Expense.create({
      userId: req.user.id,
      name,
      amount,
      category,
      date,
      note
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
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
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
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;