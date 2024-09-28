const DocumentUploadStatus = require('../models/otDocUploadModel');
const OnboardingTask = require('../models/onboardingTaskModel');

// Create or update document upload status
exports.updateDocumentUploadStatus = async (req, res) => {
    const { candidateId, onboardingTaskId, documentName } = req.body;

    try {
        let status = await DocumentUploadStatus.findOne({ candidateId, onboardingTaskId, documentName });

        if (!status) {
            // Create a new document upload status if it doesn't exist
            status = new DocumentUploadStatus({ candidateId, onboardingTaskId, documentName, isUploaded: true, uploadedAt: new Date() });
        } else {
            // Update existing status
            status.isUploaded = true;
            status.uploadedAt = new Date();
        }

        await status.save();
        res.status(200).json({ message: 'Document upload status updated', status });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Update document upload status
exports.updateDocumentUploadStatus = async (req, res) => {
    const { candidateId, onboardingTaskId, documentName } = req.body;

    try {
        let status = await DocumentUploadStatus.findOne({ candidateId, onboardingTaskId, documentName });

        if (!status) {
            // Create a new document upload status if it doesn't exist
            status = new DocumentUploadStatus({ candidateId, onboardingTaskId, documentName, isUploaded: true, uploadedAt: new Date() });
        } else {
            // Update existing status
            status.isUploaded = true;
            status.uploadedAt = new Date();
        }

        await status.save();
        res.status(200).json({ message: 'Document upload status updated', status });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete document upload status
exports.deleteDocumentUploadStatus = async (req, res) => {
    const { candidateId, onboardingTaskId, documentName } = req.params;
  
    try {
      // Decode the document name if necessary
      const decodedDocumentName = decodeURIComponent(documentName);
      
      const status = await DocumentUploadStatus.findOneAndDelete({
        candidateId,
        onboardingTaskId,
        documentName: decodedDocumentName,
      });
  
      if (!status) {
        return res.status(404).json({ message: 'Document upload status not found' });
      }
  
      res.status(200).json({ message: 'Document upload status deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
// Get document upload status for a specific candidate and onboarding task
exports.getDocumentUploadStatus = async (req, res) => {
    const { candidateId, onboardingTaskId } = req.params;

    try {
        const statuses = await DocumentUploadStatus.find({ candidateId, onboardingTaskId });
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// New method to get onboarding task details for a specific onboarding task ID
exports.getOnboardingTaskDetails = async (req, res) => {
    const { onboardingTaskId } = req.params;

    try {
        const task = await OnboardingTask.findById(onboardingTaskId)
            .populate('employerId', 'name') // Populate employer details
            .populate('jobId', 'title') // Populate job details
            .exec();

        if (!task) {
            return res.status(404).json({ message: 'Onboarding task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};