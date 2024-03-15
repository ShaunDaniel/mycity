const express = require('express');
const router = express.Router();
const Issue = require('../models/issue');

// Get all issues
router.get('/', async (req, res) => {
    try {
        const issues = await Issue.find();
        res.json(issues);
    } catch (err) {
        res.json({ message: err });
    }
});

// Get a specific issue
router.get('/:issueId', async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.issueId);
        res.json(issue);
    } catch (err) {
        res.json({ message: err });
    }
});

// Create a new issue
router.post('/', async (req, res) => {
    const issue = new Issue({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
    });

    try {
        const savedIssue = await issue.save();
        res.json(savedIssue);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;