import React from 'react'
import {
    AlertCircle,
    CheckCircle,
    Info,
    TrendingUp,
    Award,
    Zap,
    BookOpen,
    FileText,
    Users,
    Code,
    BarChart3
} from 'lucide-react'

const AnalysisDashboard = ({ analysis }) => {
    if (!analysis) {
        return <div className="text-center py-8">No analysis available</div>
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getScoreBgColor = (score) => {
        if (score >= 80) return 'bg-green-100'
        if (score >= 60) return 'bg-yellow-100'
        return 'bg-red-100'
    }

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return 'border-red-500 bg-red-50'
            case 'warning':
                return 'border-yellow-500 bg-yellow-50'
            case 'info':
                return 'border-blue-500 bg-blue-50'
            default:
                return 'border-gray-500 bg-gray-50'
        }
    }

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'critical':
                return <AlertCircle className="w-5 h-5 text-red-600" />
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />
            case 'info':
                return <Info className="w-5 h-5 text-blue-600" />
            default:
                return <Info className="w-5 h-5 text-gray-600" />
        }
    }

    const getImpactColor = (impact) => {
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

    return (
        <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 space-y-8">
            {/* Overall Scores Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`rounded-lg p-6 text-center shadow-lg border-2 ${getScoreBgColor(analysis.overallScore)} border-opacity-30`}>
                    <div className="flex justify-center mb-3">
                        <Award className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Overall Score</h3>
                    <p className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">/100</p>
                </div>

                <div className={`rounded-lg p-6 text-center shadow-lg border-2 ${getScoreBgColor(analysis.atsScore)} border-opacity-30`}>
                    <div className="flex justify-center mb-3">
                        <Zap className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">ATS Score</h3>
                    <p className={`text-4xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                        {analysis.atsScore}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">ATS Compatible</p>
                </div>

                <div className={`rounded-lg p-6 text-center shadow-lg border-2 ${getScoreBgColor(analysis.contentScore)} border-opacity-30`}>
                    <div className="flex justify-center mb-3">
                        <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Content Score</h3>
                    <p className={`text-4xl font-bold ${getScoreColor(analysis.contentScore)}`}>
                        {analysis.contentScore}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">Quality & Impact</p>
                </div>

                <div className={`rounded-lg p-6 text-center shadow-lg border-2 ${getScoreBgColor(analysis.formatScore)} border-opacity-30`}>
                    <div className="flex justify-center mb-3">
                        <BarChart3 className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Format Score</h3>
                    <p className={`text-4xl font-bold ${getScoreColor(analysis.formatScore)}`}>
                        {analysis.formatScore}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">Structure & Design</p>
                </div>
            </div>

            {/* Section Scores */}
            {analysis.sections && (
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        Section Analysis
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(analysis.sections).map(([section, data]) => (
                            <div key={section} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-700 capitalize">
                                        {section.replace(/_/g, ' ')}
                                    </span>
                                    {data.present ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </div>
                                {data.score && (
                                    <p className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                                        {data.score}
                                    </p>
                                )}
                                {data.feedback && (
                                    <p className="text-xs text-gray-600 mt-2">{data.feedback}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-md border border-green-200 border-l-4">
                    <h2 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6" />
                        Strengths
                    </h2>
                    <div className="space-y-4">
                        {analysis.strengths.map((strength, idx) => (
                            <div key={idx} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-green-900">{strength.title}</h3>
                                    {strength.score && (
                                        <span className={`text-sm font-bold ${getScoreColor(strength.score)}`}>
                                            {strength.score}%
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-green-800">{strength.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Critical Issues & Warnings */}
            {analysis.issues && analysis.issues.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-md border border-red-200 border-l-4">
                    <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        Issues Found
                    </h2>
                    <div className="space-y-4">
                        {analysis.issues.map((issue, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(issue.severity)}`}>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        {getSeverityIcon(issue.severity)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                                            <span className={`text-xs font-bold px-2 py-1 rounded capitalize ${
                                                issue.severity === 'critical' ? 'bg-red-200 text-red-800' :
                                                issue.severity === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                                                'bg-blue-200 text-blue-800'
                                            }`}>
                                                {issue.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1">{issue.description}</p>
                                        {issue.suggestion && (
                                            <p className="text-sm font-semibold text-gray-800 mt-2">
                                                💡 Suggestion: {issue.suggestion}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-md border border-blue-200 border-l-4">
                    <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6" />
                        Improvement Suggestions
                    </h2>
                    <div className="space-y-3">
                        {analysis.suggestions.map((suggestion, idx) => (
                            <div key={idx} className="p-4 bg-blue-50 rounded-lg flex items-start gap-3 border border-blue-200">
                                <TrendingUp className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{suggestion.category}</h3>
                                            <p className="text-sm text-gray-700 mt-1">{suggestion.suggestion}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${getImpactColor(suggestion.impact)}`}>
                                            {suggestion.impact} impact
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Keyword Analysis */}
            {analysis.keywordAnalysis && (
                <div className="bg-white rounded-lg p-6 shadow-md border border-purple-200 border-l-4">
                    <h2 className="text-xl font-bold text-purple-700 mb-6 flex items-center gap-2">
                        <Code className="w-6 h-6" />
                        Keyword Analysis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Present Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {analysis.keywordAnalysis.presentKeywords && analysis.keywordAnalysis.presentKeywords.map((keyword, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Missing Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {analysis.keywordAnalysis.missingKeywords && analysis.keywordAnalysis.missingKeywords.map((keyword, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {analysis.keywordAnalysis.keywordDensity && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <strong>Keyword Density:</strong> {analysis.keywordAnalysis.keywordDensity}%
                            </p>
                        </div>
                    )}
                    {analysis.keywordAnalysis.industryRelevance && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <strong>Industry Relevance:</strong> {analysis.keywordAnalysis.industryRelevance}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ATS Compatibility */}
            {analysis.atsCompatibility && (
                <div className="bg-white rounded-lg p-6 shadow-md border border-orange-200 border-l-4">
                    <h2 className="text-xl font-bold text-orange-700 mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        ATS Compatibility Details
                    </h2>
                    <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>ATS Score:</strong> <span className={`font-bold ${getScoreColor(analysis.atsCompatibility.score)}`}>{analysis.atsCompatibility.score}%</span>
                        </p>
                    </div>
                    {analysis.atsCompatibility.warnings && analysis.atsCompatibility.warnings.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-900 mb-2">⚠️ Warnings</h3>
                            <ul className="space-y-2">
                                {analysis.atsCompatibility.warnings.map((warning, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-yellow-600 mt-1">•</span>
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {analysis.atsCompatibility.recommendations && analysis.atsCompatibility.recommendations.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">✓ Recommendations</h3>
                            <ul className="space-y-2">
                                {analysis.atsCompatibility.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-green-600 mt-1">•</span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Formatting Details */}
            {analysis.formatting && (
                <div className="bg-white rounded-lg p-6 shadow-md border border-indigo-200 border-l-4">
                    <h2 className="text-xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        Formatting Analysis
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-4 bg-indigo-50 rounded-lg text-center border border-indigo-200">
                            <div className="flex justify-center mb-2">
                                {analysis.formatting.hasClearStructure ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Clear Structure</p>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-lg text-center border border-indigo-200">
                            <div className="flex justify-center mb-2">
                                {analysis.formatting.useOfBulletPoints ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Bullet Points</p>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-lg text-center border border-indigo-200">
                            <div className="flex justify-center mb-2">
                                {analysis.formatting.consistentFormatting ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Consistency</p>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-lg text-center border border-indigo-200">
                            <div className="flex justify-center mb-2">
                                {analysis.formatting.appropriateLength ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Length</p>
                        </div>
                    </div>
                    {analysis.formatting.feedback && (
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                            <p className="text-sm text-gray-700">{analysis.formatting.feedback}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AnalysisDashboard
