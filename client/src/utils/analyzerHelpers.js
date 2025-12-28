// Helper functions for Resume Analyzer

/**
 * Format score with color based on value
 * @param {number} score - Score between 0-100
 * @returns {string} Color class name
 */
export const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
}

/**
 * Get background color for score card
 * @param {number} score - Score between 0-100
 * @returns {string} Background color class
 */
export const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
}

/**
 * Get severity icon and color
 * @param {string} severity - 'critical', 'warning', or 'info'
 * @returns {object} Icon component and color
 */
export const getSeverityStyles = (severity) => {
    const styles = {
        critical: {
            borderColor: 'border-red-500',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
            badgeColor: 'bg-red-200 text-red-800'
        },
        warning: {
            borderColor: 'border-yellow-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600',
            badgeColor: 'bg-yellow-200 text-yellow-800'
        },
        info: {
            borderColor: 'border-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            badgeColor: 'bg-blue-200 text-blue-800'
        }
    }
    return styles[severity] || styles.info
}

/**
 * Get impact badge color
 * @param {string} impact - 'high', 'medium', or 'low'
 * @returns {string} Badge color class
 */
export const getImpactColor = (impact) => {
    switch (impact) {
        case 'high':
            return 'bg-red-100 text-red-800'
        case 'medium':
            return 'bg-yellow-100 text-yellow-800'
        case 'low':
            return 'bg-blue-100 text-blue-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

/**
 * Calculate score percentage
 * @param {number} score - Numeric score
 * @param {number} maxScore - Maximum possible score
 * @returns {number} Percentage
 */
export const calculatePercentage = (score, maxScore = 100) => {
    return Math.round((score / maxScore) * 100)
}

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Determine score quality level
 * @param {number} score - Score 0-100
 * @returns {string} Quality level
 */
export const getScoreLevel = (score) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 70) return 'Fair'
    if (score >= 60) return 'Needs Improvement'
    return 'Poor'
}

/**
 * Count critical issues in analysis
 * @param {array} issues - Issues array
 * @returns {object} Count by severity
 */
export const countIssuesBySeverity = (issues = []) => {
    return {
        critical: issues.filter(i => i.severity === 'critical').length,
        warning: issues.filter(i => i.severity === 'warning').length,
        info: issues.filter(i => i.severity === 'info').length,
        total: issues.length
    }
}

/**
 * Count suggestions by impact
 * @param {array} suggestions - Suggestions array
 * @returns {object} Count by impact
 */
export const countSuggestionsByImpact = (suggestions = []) => {
    return {
        high: suggestions.filter(s => s.impact === 'high').length,
        medium: suggestions.filter(s => s.impact === 'medium').length,
        low: suggestions.filter(s => s.impact === 'low').length,
        total: suggestions.length
    }
}

/**
 * Get score improvement recommendation
 * @param {number} currentScore - Current score
 * @param {number} targetScore - Target score (default 90)
 * @returns {string} Recommendation text
 */
export const getScoreImprovement = (currentScore, targetScore = 90) => {
    const gap = targetScore - currentScore
    if (gap <= 0) return "Your score is excellent!"
    if (gap <= 10) return `Just ${gap} points away from excellence!`
    if (gap <= 20) return `${gap} points of improvements needed`
    return `Significant improvements possible - ${gap} points gap`
}

/**
 * Prioritize suggestions by impact
 * @param {array} suggestions - Suggestions array
 * @returns {array} Sorted suggestions
 */
export const prioritizeSuggestions = (suggestions = []) => {
    const priorityMap = { high: 1, medium: 2, low: 3 }
    return [...suggestions].sort((a, b) => {
        return priorityMap[a.impact] - priorityMap[b.impact]
    })
}

/**
 * Filter issues by severity
 * @param {array} issues - Issues array
 * @param {string} severity - Severity to filter
 * @returns {array} Filtered issues
 */
export const filterIssuesBySeverity = (issues = [], severity) => {
    return issues.filter(issue => issue.severity === severity)
}

/**
 * Get section status
 * @param {object} section - Section data
 * @returns {object} Status with icon and color
 */
export const getSectionStatus = (section) => {
    if (!section.present) {
        return { status: 'Missing', icon: '❌', color: 'text-red-600' }
    }
    if (section.score >= 80) {
        return { status: 'Excellent', icon: '✅', color: 'text-green-600' }
    }
    if (section.score >= 60) {
        return { status: 'Good', icon: '✓', color: 'text-yellow-600' }
    }
    return { status: 'Needs Work', icon: '⚠️', color: 'text-red-600' }
}

/**
 * Generate summary of analysis
 * @param {object} analysis - Full analysis object
 * @returns {string} Text summary
 */
export const generateAnalysisSummary = (analysis) => {
    if (!analysis) return ''
    
    const criticalIssues = countIssuesBySeverity(analysis.issues).critical
    const avgScore = Math.round(
        (analysis.overallScore + analysis.atsScore + analysis.contentScore + analysis.formatScore) / 4
    )
    
    let summary = `Resume Score: ${analysis.overallScore}/100. `
    
    if (criticalIssues > 0) {
        summary += `⚠️ ${criticalIssues} critical issue(s) to fix. `
    }
    
    if (analysis.suggestions?.length > 0) {
        summary += `💡 ${analysis.suggestions.length} suggestions for improvement. `
    }
    
    if (analysis.strengths?.length > 0) {
        summary += `✨ ${analysis.strengths.length} strong areas identified.`
    }
    
    return summary
}

/**
 * Export analysis as formatted text
 * @param {object} analysis - Analysis object
 * @returns {string} Formatted text
 */
export const exportAnalysisAsText = (analysis) => {
    let text = '=== RESUME ANALYSIS REPORT ===\n\n'
    
    text += `OVERALL SCORES\n`
    text += `Overall Score: ${analysis.overallScore}/100\n`
    text += `ATS Score: ${analysis.atsScore}/100\n`
    text += `Content Score: ${analysis.contentScore}/100\n`
    text += `Format Score: ${analysis.formatScore}/100\n\n`
    
    if (analysis.strengths?.length > 0) {
        text += `STRENGTHS\n`
        analysis.strengths.forEach((s, i) => {
            text += `${i + 1}. ${s.title}\n   ${s.description}\n`
        })
        text += '\n'
    }
    
    if (analysis.issues?.length > 0) {
        text += `ISSUES FOUND\n`
        analysis.issues.forEach((issue, i) => {
            text += `${i + 1}. [${issue.severity.toUpperCase()}] ${issue.title}\n   ${issue.description}\n`
        })
        text += '\n'
    }
    
    if (analysis.suggestions?.length > 0) {
        text += `SUGGESTIONS\n`
        analysis.suggestions.forEach((s, i) => {
            text += `${i + 1}. ${s.category}: ${s.suggestion} (${s.impact} impact)\n`
        })
        text += '\n'
    }
    
    return text
}

/**
 * Check if analysis is outdated (older than 30 days)
 * @param {string} analysisDate - Analysis creation date
 * @returns {boolean}
 */
export const isAnalysisOutdated = (analysisDate) => {
    const analysisTime = new Date(analysisDate).getTime()
    const currentTime = new Date().getTime()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    return (currentTime - analysisTime) > thirtyDaysMs
}

/**
 * Get recommendations based on analysis
 * @param {object} analysis - Analysis object
 * @returns {array} Array of key recommendations
 */
export const getTopRecommendations = (analysis, limit = 5) => {
    const recommendations = []
    
    // Get critical issues
    if (analysis.issues) {
        const criticalIssues = analysis.issues
            .filter(i => i.severity === 'critical')
            .slice(0, 2)
        recommendations.push(...criticalIssues.map(i => ({
            type: 'critical',
            text: i.suggestion || i.title
        })))
    }
    
    // Get high impact suggestions
    if (analysis.suggestions) {
        const highImpact = analysis.suggestions
            .filter(s => s.impact === 'high')
            .slice(0, limit - recommendations.length)
        recommendations.push(...highImpact.map(s => ({
            type: 'suggestion',
            text: s.suggestion
        })))
    }
    
    return recommendations.slice(0, limit)
}

export default {
    getScoreColor,
    getScoreBgColor,
    getSeverityStyles,
    getImpactColor,
    calculatePercentage,
    formatDate,
    getScoreLevel,
    countIssuesBySeverity,
    countSuggestionsByImpact,
    getScoreImprovement,
    prioritizeSuggestions,
    filterIssuesBySeverity,
    getSectionStatus,
    generateAnalysisSummary,
    exportAnalysisAsText,
    isAnalysisOutdated,
    getTopRecommendations
}
