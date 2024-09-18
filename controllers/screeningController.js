const Screening = require('../models/screeningModel');
const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');
const Candidate = require('../models/candidateModel');
const Test = require('../models/testModel');
const { sendEmail } = require('../utils/emailService');

exports.startScreening = async (req, res) => {
  const { applicationId } = req.body;

  try {
    const application = await Application.findById(applicationId).populate('jobId').populate('candidateId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // const job = await Job.findById(application.jobId);
    // if (!job) {
    //   return res.status(404).json({ message: 'Job not found' });
    // }

    // const candidate = await Candidate.findOne({ userId: application.candidateId });
    // if (!candidate) {
    //   return res.status(404).json({ message: 'Candidate not found' });
    // }

    const job = application.jobId;
    const candidate = application.candidateId;

    // Check if screening already exists
    let screening = await Screening.findOne({ applicationId });
    if (screening) {
      return res.status(400).json({ message: 'Screening already exists for this application' });
    }

    screening = new Screening({ applicationId });
    await screening.save();

    application.screeningId = screening._id;
    await application.save();

    // Log the candidate skills and job required skills
    console.log('Candidate skills:', candidate.skills);
    console.log('Job required skills:', job.skillsRequired);


    // // Start Stage 1 screening
    // const skillsMatched = candidate.skills.filter(skill => job.skillsRequired.includes(skill));
    // const skillsMissing = job.skillsRequired.filter(skill => !candidate.skills.includes(skill));

    // Start Stage 1 screening
    const skillsMatched = candidate.skills ? candidate.skills.filter(skill => job.skillsRequired && job.skillsRequired.includes(skill)) : [];
    const skillsMissing = job.skillsRequired ? job.skillsRequired.filter(skill => !candidate.skills || !candidate.skills.includes(skill)) : [];


    screening.stage1 = {
      passed: skillsMissing.length < 2 && skillsMatched.length >= 2,
      skillsMatched,
      skillsMissing
    };
    screening.currentStage = screening.stage1.passed ? 2 : 1;
    await screening.save();

    // Send email based on Stage 1 result
    if (screening.stage1.passed) {
      sendEmail(candidate.email, 'Congratulations! You\'ve passed Stage 1', 'You\'ve moved to Stage 2 of the screening process.');
    } else {
      sendEmail(candidate.email, 'Thank you for your application', 'Unfortunately, you did not meet all the required skills for this position.');
    }

    res.status(200).json({ message: 'Screening started', screening });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.processStage2 = async (req, res) => {
  const { screeningId, atsScore } = req.body;

  try {
    const screening = await Screening.findById(screeningId).populate({
      path: 'applicationId',
      populate: { path: 'jobId' }
    });

    const application = screening.applicationId;
    const job = application.jobId;

    screening.stage2 = {
      passed: atsScore >= 70 && application.expectedSalary <= job.expectedSalaryRange.max,
      atsScore,
      expectedSalary: application.expectedSalary
    };

    screening.currentStage = screening.stage2.passed ? 3 : 2;
    await screening.save();

    // Send email based on Stage 2 result
    if (screening.stage2.passed) {
      sendEmail(application.candidateId.email, 'Congratulations! You\'ve passed Stage 2', 'You\'ve moved to Stage 3 of the screening process.');
    } else {
      sendEmail(application.candidateId.email, 'Thank you for your application', 'Unfortunately, you did not pass Stage 2 of the screening process.');
    }

    res.status(200).json({ message: 'Stage 2 processed', screening });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.processStage3 = async (req, res) => {
  const { screeningId, testScore } = req.body;

  try {
    const screening = await Screening.findById(screeningId).populate({
      path: 'applicationId',
      populate: { path: 'jobId' }
    });

    screening.stage3 = {
      passed: testScore >= 80,
      testScore
    };

    screening.currentStage = 4; // Screening completed
    screening.finalStatus = screening.stage3.passed ? 'Selected' : 'Rejected';
    await screening.save();

    // Send email based on final result
    const emailSubject = screening.stage3.passed ? 'Congratulations! You\'ve been selected for an interview' : 'Thank you for your application';
    const emailBody = screening.stage3.passed ? 'You\'ve successfully passed all screening stages. Please schedule your interview.' : 'Unfortunately, you did not pass the final stage of the screening process.';
    
    sendEmail(screening.applicationId.candidateId.email, emailSubject, emailBody);

    res.status(200).json({ message: 'Stage 3 processed', screening });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getScreeningByCandidate = async (req, res) => {
  const { candidateId } = req.params;

  try {
    const applications = await Application.find({ candidateId });
    const applicationIds = applications.map(app => app._id);

    const screenings = await Screening.find({ applicationId: { $in: applicationIds } })
      .populate({
        path: 'applicationId',
        populate: [
          { path: 'jobId', select: 'title company' },
          { path: 'candidateId', select: 'name email' }
        ]
      });

    if (screenings.length === 0) {
      return res.status(404).json({ message: 'No screenings found for this candidate' });
    }

    const screeningData = screenings.map(screening => ({
      jobTitle: screening.applicationId.jobId.title,
      company: screening.applicationId.jobId.company,
      currentStage: screening ? screening.currentStage : 0,
        finalStatus: screening ? screening.finalStatus : 'Not Started',
        stage1: screening ? screening.stage1 : null,
        stage2: screening ? screening.stage2 : null,
        stage3: screening ? screening.stage3 : null,
        createdAt: screening ? screening.createdAt : null,
        updatedAt: screening ? screening.updatedAt : null
      
    }));

    res.status(200).json(screeningData);
  } catch (error) {
    console.error('Error in getScreeningByCandidate:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


