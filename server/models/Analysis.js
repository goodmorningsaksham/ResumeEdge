import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    resumeText: { type: String, required: true },
    
    // Overall scores
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    atsScore: { type: Number, min: 0, max: 100, default: 0 },
    contentScore: { type: Number, min: 0, max: 100, default: 0 },
    formatScore: { type: Number, min: 0, max: 100, default: 0 },
    
    // Detailed feedback
    strengths: [
        {
            title: String,
            description: String,
            score: Number
        }
    ],
    
    issues: [
        {
            title: String,
            description: String,
            severity: { type: String, enum: ['critical', 'high', 'medium', 'low', 'warning', 'info', 'minor', 'moderate'], default: 'medium' },
            suggestion: String
        }
    ],
    
    suggestions: [
        {
            category: String,
            suggestion: String,
            impact: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' }
        }
    ],
    
    keywordAnalysis: {
        presentKeywords: [String],
        missingKeywords: [String],
        keywordDensity: Number,
        industryRelevance: String
    },
    
    sections: {
        personal: { present: Boolean, score: Number, feedback: String },
        professional_summary: { present: Boolean, score: Number, feedback: String },
        experience: { present: Boolean, score: Number, feedback: String },
        education: { present: Boolean, score: Number, feedback: String },
        skills: { present: Boolean, score: Number, feedback: String },
        projects: { present: Boolean, score: Number, feedback: String }
    },
    
    formatting: {
        hasClearStructure: Boolean,
        useOfBulletPoints: Boolean,
        consistentFormatting: Boolean,
        appropriateLength: Boolean,
        feedback: String
    },
    
    atsCompatibility: {
        score: Number,
        warnings: [String],
        recommendations: [String]
    },

    rawAnalysis: String, // Store the complete analysis from Gemini
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true, minimize: false });

const Analysis = mongoose.model('Analysis', AnalysisSchema);

export default Analysis;
