const Test = require('../models/testModel');

exports.createTest = async (req, res) => {
  const { jobId, questions, duration } = req.body;

  try {
    const test = new Test({ jobId, questions, duration });
    await test.save();

    res.status(201).json({ message: 'Test created successfully', test });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTestByJobId = async (req, res) => {
  const { jobId } = req.params;

  try {
    const test = await Test.findOne({ jobId });
    if (!test) {
      return res.status(404).json({ message: 'Test not found for this job' });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};