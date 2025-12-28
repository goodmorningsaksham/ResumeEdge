import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
    analyzeResume,
    getAnalysis,
    getUserAnalyses,
    deleteAnalysis
} from "../controllers/analyzerController.js";

const analyzerRouter = express.Router();

analyzerRouter.post('/analyze-resume', protect, analyzeResume);
analyzerRouter.get('/analysis/:resumeId', protect, getAnalysis);
analyzerRouter.get('/analyses', protect, getUserAnalyses);
analyzerRouter.delete('/analysis/:analysisId', protect, deleteAnalysis);

export default analyzerRouter;
