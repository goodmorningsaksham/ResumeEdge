import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";
import ai from "../configs/ai.js";

// Normalize severity values to valid enum values
const normalizeSeverity = (severity) => {
    const severityMap = {
        'critical': 'critical',
        'high': 'high',
        'medium': 'medium',
        'low': 'low',
        'moderate': 'medium',
        'minor': 'low',
        'warning': 'high',
        'info': 'low'
    };
    return severityMap[severity?.toLowerCase()] || 'medium';
};

// Normalize impact values to valid enum values
const normalizeImpact = (impact) => {
    const impactMap = {
        'critical': 'critical',
        'high': 'high',
        'medium': 'medium',
        'low': 'low'
    };
    return impactMap[impact?.toLowerCase()] || 'medium';
};

// Helper function to convert resume object to text
const resumeToText = (resume) => {
    let text = '';
    
    if (resume.personal_info) {
        text += `${resume.personal_info.full_name || ''}\n`;
        text += `${resume.personal_info.profession || ''}\n`;
        if (resume.personal_info.email) text += `Email: ${resume.personal_info.email}\n`;
        if (resume.personal_info.phone) text += `Phone: ${resume.personal_info.phone}\n`;
        if (resume.personal_info.location) text += `Location: ${resume.personal_info.location}\n`;
        if (resume.personal_info.linkedin) text += `LinkedIn: ${resume.personal_info.linkedin}\n`;
        text += '\n';
    }
    
    if (resume.professional_summary) {
        text += `PROFESSIONAL SUMMARY\n${resume.professional_summary}\n\n`;
    }
    
    if (resume.experience && resume.experience.length > 0) {
        text += 'EXPERIENCE\n';
        resume.experience.forEach(exp => {
            text += `${exp.position || ''} at ${exp.company || ''}\n`;
            text += `${exp.start_date || ''} - ${exp.end_date || 'Present'}\n`;
            text += `${exp.description || ''}\n\n`;
        });
    }
    
    if (resume.education && resume.education.length > 0) {
        text += 'EDUCATION\n';
        resume.education.forEach(edu => {
            text += `${edu.degree || ''} in ${edu.field || ''} from ${edu.institution || ''}\n`;
            text += `Graduation: ${edu.graduation_date || ''}\n`;
            if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
            text += '\n';
        });
    }
    
    if (resume.skills && resume.skills.length > 0) {
        text += `SKILLS\n${resume.skills.join(', ')}\n\n`;
    }
    
    if (resume.project && resume.project.length > 0) {
        text += 'PROJECTS\n';
        resume.project.forEach(proj => {
            text += `${proj.name || ''}\n`;
            text += `${proj.description || ''}\n\n`;
        });
    }
    
    return text;
};

// Parse gemini response and extract structured data
const parseAnalysisResponse = (responseText) => {
    try {
        // Remove markdown code blocks if present
        let cleanedText = responseText.trim();
        
        // Remove ```json ... ``` or ``` ... ```
        cleanedText = cleanedText.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '');
        
        // Try to extract JSON object - find first { and last }
        const firstBrace = cleanedText.indexOf('{');
        const lastBrace = cleanedText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            let jsonStr = cleanedText.substring(firstBrace, lastBrace + 1);
            
            try {
                // Try to parse the JSON
                const parsed = JSON.parse(jsonStr);
                
                // Validate it has required fields
                if (parsed.overallScore !== undefined && parsed.atsScore !== undefined) {
                    return parsed;
                }
            } catch (parseError) {
                // If JSON is incomplete, try to fix it by adding missing closing braces
                console.log('⚠️ JSON parsing failed, attempting repair...');
                
                // Count opening and closing braces
                const openBraces = (jsonStr.match(/{/g) || []).length;
                const closeBraces = (jsonStr.match(/}/g) || []).length;
                const missingBraces = openBraces - closeBraces;
                
                if (missingBraces > 0) {
                    console.log(`⚠️ Missing ${missingBraces} closing braces, attempting repair...`);
                    jsonStr += '}' + '}'. repeat(Math.max(0, missingBraces - 1));
                    
                    try {
                        const parsed = JSON.parse(jsonStr);
                        if (parsed.overallScore !== undefined && parsed.atsScore !== undefined) {
                            console.log('✅ Successfully repaired and parsed JSON');
                            return parsed;
                        }
                    } catch (repairError) {
                        console.log('❌ Repair attempt failed:', repairError.message);
                    }
                }
                throw parseError;
            }
        }
        
        // If no valid JSON found in response, log for debugging
        console.log('❌ Failed to extract valid JSON');
        console.log('Response length:', responseText.length);
        console.log('Response preview:', responseText.substring(0, 500));
        return null;
    } catch (error) {
        console.log('❌ JSON Parse Error:', error.message);
        console.log('Response length:', responseText.length);
        console.log('Full response:', responseText.substring(0, 1000) + '...');
        return null;
    }
};

// Analyze resume
// POST: /api/ai/analyze-resume
export const analyzeResume = async (req, res) => {
    try {
        const { resumeId } = req.body;
        const userId = req.userId;

        if (!resumeId) {
            return res.status(400).json({ message: 'Resume ID is required' });
        }

        // Get the resume
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Check authorization
        if (resume.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to analyze this resume' });
        }

        // Convert resume to text
        const resumeText = resumeToText(resume);

        // Call Gemini API for analysis
        const systemPrompt = `You are an expert resume reviewer and career coach. Analyze the provided resume in detail and provide a comprehensive evaluation. 

IMPORTANT: Return ONLY valid JSON, nothing else. No explanations, no markdown, just the JSON object.

{
  "overallScore": 85,
  "atsScore": 88,
  "contentScore": 82,
  "formatScore": 87,
  "strengths": [
    {
      "title": "Strong Action Verbs",
      "description": "Resume uses powerful action words",
      "score": 90
    }
  ],
  "issues": [
    {
      "title": "Too Many Details",
      "description": "Some sections have excessive information",
      "severity": "warning",
      "suggestion": "Condense information to key points"
    }
  ],
  "suggestions": [
    {
      "category": "Professional Summary",
      "suggestion": "Add quantifiable achievements",
      "impact": "high"
    }
  ],
  "keywordAnalysis": {
    "presentKeywords": ["Leadership", "Project Management", "Communication"],
    "missingKeywords": ["Python", "Data Analysis", "Cloud Computing"],
    "keywordDensity": 78,
    "industryRelevance": "Matches 85% of industry standards"
  },
  "sections": {
    "personal": { "present": true, "score": 90, "feedback": "Complete contact information" },
    "professional_summary": { "present": true, "score": 85, "feedback": "Good but could be more impactful" },
    "experience": { "present": true, "score": 88, "feedback": "Well structured experience section" },
    "education": { "present": true, "score": 82, "feedback": "Complete education details" },
    "skills": { "present": true, "score": 92, "feedback": "Excellent skill section" },
    "projects": { "present": false, "score": 0, "feedback": "No projects section found" }
  },
  "formatting": {
    "hasClearStructure": true,
    "useOfBulletPoints": true,
    "consistentFormatting": true,
    "appropriateLength": true,
    "feedback": "Professional formatting"
  },
  "atsCompatibility": {
    "score": 88,
    "warnings": ["Some special characters may not parse"],
    "recommendations": ["Use standard fonts", "Avoid tables"]
  }
}`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `Please analyze this resume:\n\n${resumeText}`
                }
            ],
            temperature: 0.5,
            max_tokens: 8000
        });

        const analysisText = response.choices[0].message.content;
        const analysisData = parseAnalysisResponse(analysisText);

        if (!analysisData) {
            console.log('❌ Analysis failed to parse');
            console.log('Full response:', analysisText);
            return res.status(500).json({ 
                message: 'Failed to parse analysis response. The AI response was incomplete or malformed. Please try again.',
                debug: 'JSON parsing failed - response may be truncated'
            });
        }
        
        console.log('✅ Analysis parsed successfully:', {
            overall: analysisData.overallScore,
            ats: analysisData.atsScore,
            issues: analysisData.issues?.length || 0,
            suggestions: analysisData.suggestions?.length || 0
        });

        // Normalize severity and impact values
        const normalizedIssues = (analysisData.issues || []).map(issue => ({
            ...issue,
            severity: normalizeSeverity(issue.severity)
        }));
        
        const normalizedSuggestions = (analysisData.suggestions || []).map(suggestion => ({
            ...suggestion,
            impact: normalizeImpact(suggestion.impact)
        }));

        // Create analysis record
        const analysis = new Analysis({
            userId,
            resumeId,
            resumeText,
            overallScore: analysisData.overallScore || 0,
            atsScore: analysisData.atsScore || 0,
            contentScore: analysisData.contentScore || 0,
            formatScore: analysisData.formatScore || 0,
            strengths: analysisData.strengths || [],
            issues: normalizedIssues,
            suggestions: normalizedSuggestions,
            keywordAnalysis: analysisData.keywordAnalysis || {},
            sections: analysisData.sections || {},
            formatting: analysisData.formatting || {},
            atsCompatibility: analysisData.atsCompatibility || {},
            rawAnalysis: analysisText
        });

        await analysis.save();

        return res.status(201).json({
            message: 'Resume analyzed successfully',
            analysis: analysis
        });

    } catch (error) {
        console.log('Error analyzing resume:', error);
        return res.status(400).json({ message: error.message });
    }
};

// Get analysis for a resume
// GET: /api/ai/analysis/:resumeId
export const getAnalysis = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const userId = req.userId;

        const analysis = await Analysis.findOne({ resumeId, userId });
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        return res.status(200).json({ analysis });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Get all analyses for user
// GET: /api/ai/analyses
export const getUserAnalyses = async (req, res) => {
    try {
        const userId = req.userId;

        const analyses = await Analysis.find({ userId })
            .populate('resumeId', 'title personal_info')
            .sort({ createdAt: -1 });

        return res.status(200).json({ analyses });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Delete analysis
// DELETE: /api/ai/analysis/:analysisId
export const deleteAnalysis = async (req, res) => {
    try {
        const { analysisId } = req.params;
        const userId = req.userId;

        const analysis = await Analysis.findById(analysisId);
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        if (analysis.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Analysis.findByIdAndDelete(analysisId);
        return res.status(200).json({ message: 'Analysis deleted successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
