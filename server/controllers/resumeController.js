import Resume from "../models/Resume.js";

// controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        const newResume = await Resume.create({ userId, title });
        return res.status(201).json({ message: 'Resume created successfully', resume: newResume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// controller for deleting a resume
// DELETE: /api/resumes/delete/:resumeId
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({ userId, _id: resumeId });
        return res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// get user resume by id
// GET: /api/resumes/get/:resumeId
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ userId, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Cleaning up response
        const resumeObj = resume.toObject();
        delete resumeObj.__v;
        delete resumeObj.createdAt;
        delete resumeObj.updatedAt;

        return res.status(200).json({ resume: resumeObj });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// get resume by id public
// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ public: true, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// controller for updating a resume
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData } = req.body;
        
        // When using multer-s3, the file info is here:
        const imageFile = req.file; 
        
        let resumeDataCopy;
        if (typeof resumeData === 'string') {
            resumeDataCopy = JSON.parse(resumeData);
        } else {
            resumeDataCopy = structuredClone(resumeData);
        }

        // If a new image was uploaded to S3
        if (imageFile) {
            // imageFile.location is the URL provided by AWS S3
            resumeDataCopy.personal_info.image = imageFile.location;
        }

        const resume = await Resume.findOneAndUpdate(
            { userId, _id: resumeId }, 
            resumeDataCopy, 
            { new: true }
        );

        if (!resume) {
            return res.status(404).json({ message: "Resume not found or unauthorized" });
        }

        return res.status(200).json({ message: 'Saved successfully', resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};