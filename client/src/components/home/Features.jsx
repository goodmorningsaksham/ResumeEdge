import { Zap } from 'lucide-react';
import React from 'react'
import Title from './Title';

const Features = () => {
    const [isHover, setIsHover] = React.useState(false);

    return (
        <div id='features' className='flex flex-col items-center my-10 scroll-mt-12'>

            <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-100 rounded-full px-6 py-1.5">
                <Zap width={14} />
                <span>Simple Process</span>
            </div>
            
            <Title title='Build and Analyse your resume' description='Our streamlined platform enables you to build a professional, job-ready resume in minutes using guided templates and smart formatting. Once created, your resume is analyzed with advanced AI intelligence and industry-specific metrics to evaluate structure, skills alignment, keyword relevance, and overall impact. This ensures your resume meets current hiring standards and is optimized for both recruiters and applicant tracking systems (ATS).' />
            {/* Changed Layout Wrapper to flex-col to stack image on top */}
            <div className="flex flex-col items-center w-full max-w-7xl">
                
                {/* Image: Removed side margins, added margin-bottom */}
                <img className="max-w-2xl w-full mb-6" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png" alt="" />
                
                {/* Features Container: Added Grid for Horizontal Layout */}
                <div 
                    className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-6 w-full" 
                    onMouseEnter={() => setIsHover(true)} 
                    onMouseLeave={() => setIsHover(false)}
                >
                    
                    {/* Feature 1 */}
                    <div className={"flex items-center justify-center group cursor-pointer"}>
                        <div className={`p-6 w-full h-full group-hover:bg-violet-100 border border-transparent group-hover:border-violet-300 flex gap-4 rounded-xl transition-colors ${!isHover ? 'border-violet-300 bg-violet-100' : ''}`}>
                            <div className="shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 stroke-violet-600"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">Real-Time Analytics</h3>
                                <p className="text-sm text-slate-600">Get instant insights into your finances with live dashboards.</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-center justify-center group cursor-pointer">
                        <div className="p-6 w-full h-full group-hover:bg-purple-100 border border-transparent group-hover:border-purple-300 flex gap-4 rounded-xl transition-colors">
                            <div className="shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 stroke-purple-600"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">Bank-Grade Security</h3>
                                <p className="text-sm text-slate-600">End-to-end encryption, 2FA, compliance with GDPR standards.</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-center justify-center group cursor-pointer">
                        <div className="p-6 w-full h-full group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 flex gap-4 rounded-xl transition-colors">
                            <div className="shrink-0">
                                <svg className="size-6 stroke-orange-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /></svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">Customizable Resumes</h3>
                                <p className="text-sm text-slate-600">Create, edit or export professional, industry-level resumes.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </div>
    )
}

export default Features