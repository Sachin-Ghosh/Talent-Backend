const Test = require('../models/testModel');
const TestResult = require('../models/testResultModel');
const Application = require('../models/applicationModel');
const Screening = require('../models/screeningModel');
const { sendEmail } = require('../utils/emailService');

exports.createTest = async (req, res) => {
  const { jobId, questions, img, duration } = req.body;

  try {
    const test = new Test({ jobId, questions, img, duration });
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

exports.getTestByCandidateAndJob = async (req, res) => {
  const { candidateId, jobId } = req.params;

  try {
    // Find the application for the candidate and job
    const application = await Application.findOne({ candidateId, jobId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found for this candidate and job' });
    }

    // Find the test for the job
    const test = await Test.findOne({ jobId });
    if (!test) {
      return res.status(404).json({ message: 'Test not found for this job' });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.submitTest = async (req, res) => {
  const { candidateId, jobId, testId, responses } = req.body;

  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    let score = 0;
    responses.forEach(response => {
      const question = test.questions.id(response.questionId);
      if (question && question.correctAnswer === response.selectedOption) {
        score += question.score;
      }
    });

    const testResult = new TestResult({
      candidateId,
      jobId,
      testId,
      responses,
      score
    });

    await testResult.save();

    res.status(201).json({ message: 'Test submitted successfully', testResult });
  } catch (error) {
    console.error('Error in submitTest:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.endJobRecruitment = async (req, res) => {
  const { jobId } = req.body;

  try {
    const test = await Test.findOne({ jobId });
    if (!test) {
      return res.status(404).json({ message: 'Test not found for this job' });
    }

    const testResults = await TestResult.find({ jobId });
    const totalCandidates = testResults.length;
    const totalScore = test.questions.reduce((acc, question) => acc + question.score, 0);

    // Algorithm to determine passing score
    const passingScore = totalScore * 0.6; // Example: 60% of the total score

    // Update screening results
    for (const result of testResults) {
      const application = await Application.findOne({ candidateId: result.candidateId, jobId: result.jobId });
      if (application) {
        const screening = await Screening.findOne({ applicationId: application._id });
        if (screening) {
          screening.stage3 = {
            passed: result.score >= passingScore,
            testScore: result.score
          };
          screening.currentStage = 4; // Screening completed
          screening.finalStatus = screening.stage3.passed ? 'Selected' : 'Rejected';
          await screening.save();

          // Send email based on final result
          const emailSubject = screening.stage3.passed ? 'Congratulations! You\'ve been selected for an interview' : 'Thank you for your application';
          const emailBody = screening.stage3.passed ? 'You\'ve successfully passed all screening stages. Please schedule your interview.' : 'Unfortunately, you did not pass the final stage of the screening process.';
          
          sendEmail(application.candidateId.email, emailSubject, emailBody);
        }
      }
    }

    res.status(200).json({ message: 'Job recruitment ended successfully' });
  } catch (error) {
    console.error('Error in endJobRecruitment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};