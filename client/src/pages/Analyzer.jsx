import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
    ArrowLeft,
    Loader as LoaderIcon,
    RefreshCw,
    Download,
    Share2,
    Trash2
} from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'
import AnalysisDashboard from '../components/AnalysisDashboard'
import Loader from '../components/Loader'

const Analyzer = () => {
    const { resumeId } = useParams()
    const navigate = useNavigate()
    const { token } = useSelector(state => state.auth)

    const [resume, setResume] = useState(null)
    const [analysis, setAnalysis] = useState(null)
    const [loading, setLoading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)

    // Load resume data
    const loadResume = async () => {
        try {
            setLoading(true)
            const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
                headers: { Authorization: token }
            })
            if (data.resume) {
                setResume(data.resume)
            }
        } catch (error) {
            toast.error('Failed to load resume')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Load existing analysis
    const loadAnalysis = async () => {
        try {
            const { data } = await api.get(`/api/analyzer/analysis/${resumeId}`, {
                headers: { Authorization: token }
            })
            if (data.analysis) {
                setAnalysis(data.analysis)
            }
        } catch (error) {
            console.log('No existing analysis found')
        }
    }

    // Analyze resume
    const handleAnalyzeResume = async () => {
        try {
            setAnalyzing(true)
            const { data } = await api.post(
                '/api/analyzer/analyze-resume',
                { resumeId },
                { headers: { Authorization: token } }
            )
            setAnalysis(data.analysis)
            toast.success('Resume analyzed successfully!')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to analyze resume')
            console.error(error)
        } finally {
            setAnalyzing(false)
        }
    }

    // Delete analysis
    const handleDeleteAnalysis = async () => {
        if (!window.confirm('Are you sure you want to delete this analysis?')) {
            return
        }

        try {
            await api.delete(`/api/analyzer/analysis/${analysis._id}`, {
                headers: { Authorization: token }
            })
            setAnalysis(null)
            toast.success('Analysis deleted')
        } catch (error) {
            toast.error('Failed to delete analysis')
            console.error(error)
        }
    }

    // Download analysis as JSON
    const downloadAnalysis = () => {
        if (!analysis) return

        const dataStr = JSON.stringify(analysis, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `resume-analysis-${resume?.title || 'resume'}.json`
        link.click()
        URL.revokeObjectURL(url)
        toast.success('Analysis downloaded')
    }

    useEffect(() => {
        loadResume()
        loadAnalysis()
    }, [resumeId])

    if (loading) {
        return <Loader />
    }

    if (!resume) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Resume not found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Go back"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-700" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Resume Analysis
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {resume.personal_info?.full_name || resume.title}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleAnalyzeResume}
                            disabled={analyzing}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {analyzing ? (
                                <>
                                    <LoaderIcon className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-5 h-5" />
                                    {analysis ? 'Re-analyze' : 'Analyze Resume'}
                                </>
                            )}
                        </button>

                        {analysis && (
                            <>
                                <button
                                    onClick={downloadAnalysis}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                    Download
                                </button>

                                <button
                                    onClick={() => toast.success('Share functionality coming soon')}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Share
                                </button>

                                <button
                                    onClick={handleDeleteAnalysis}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {!analysis ? (
                    <div className="bg-white rounded-lg p-12 text-center shadow-md">
                        <div className="max-w-md mx-auto">
                            <div className="mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                                    <RefreshCw className="w-10 h-10 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Ready to Analyze Your Resume?
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Get detailed insights about your resume including ATS compatibility, content quality, formatting, and personalized recommendations.
                            </p>
                            <button
                                onClick={handleAnalyzeResume}
                                disabled={analyzing}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {analyzing ? (
                                    <>
                                        <LoaderIcon className="w-5 h-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-5 h-5" />
                                        Start Analysis
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <AnalysisDashboard analysis={analysis} />
                )}
            </div>
        </div>
    )
}

export default Analyzer
