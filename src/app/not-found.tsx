"use client";
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <div className="relative min-h-screen mt-16 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-red-50">

                <div className="absolute inset-0">
                    <div className="absolute rounded-full top-20 left-20 w-72 h-72 bg-red-500/10 blur-xl animate-pulse"></div>
                    <div className="absolute delay-1000 rounded-full bottom-20 right-20 w-96 h-96 bg-red-400/8 blur-xl animate-pulse"></div>
                    <div className="absolute w-64 h-64 delay-500 rounded-full top-1/2 left-1/4 bg-red-300/10 blur-xl animate-pulse"></div>
                </div>

                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23dc2626&quot; fill-opacity=&quot;0.03&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

                <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
                    <div className="w-full mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="space-y-8 text-gray-800">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 border rounded-full bg-red-100/80 border-red-200/50 backdrop-blur-sm">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Error 404
                                    </div>

                                    <h1 className="font-black leading-none text-transparent text-7xl md:text-9xl bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text">
                                        404
                                    </h1>

                                    <div className="space-y-3">
                                        <h2 className="text-3xl font-bold text-gray-900 md:text-5xl">
                                            Oops! Page Not Found
                                        </h2>
                                        <p className="max-w-md text-xl leading-relaxed text-gray-600">
                                            The page you&apos;re looking for seems to have vanished into the digital void.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Link href="/" className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-300 ease-out transform shadow-lg group bg-gradient-to-r from-red-600 to-red-500 rounded-xl hover:shadow-xl hover:-translate-y-1 hover:from-red-700 hover:to-red-600">
                                        <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to Home
                                    </Link>

                                    <button type="button" onClick={() => window.history.back()} className="inline-flex items-center justify-center px-8 py-4 font-semibold text-gray-700 transition-all duration-300 border border-gray-200 bg-white/80 rounded-xl backdrop-blur-sm hover:bg-white hover:shadow-md">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                        </svg>
                                        Go Back
                                    </button>
                                </div>

                                <div className="pt-8 border-t border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        Need help? Contact our support team
                                        <Link href={`tel:+971553721525`} className="ml-1 text-red-600 underline hover:text-red-700 decoration-dotted">
                                            help center
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="relative max-w-lg mx-auto aspect-square">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
                                    <div className="relative p-4 border border-red-100 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl">
                                        <iframe src="https://lottie.host/embed/5abd1762-ebc9-4ac1-ab22-7afbab9a125d/1dLuknM6Dd.lottie" className="w-full h-full rounded-2xl" style={{ border: "none", minHeight: "500px" }} allowFullScreen />
                                    </div>
                                    <div className="absolute w-8 h-8 delay-300 rotate-45 rounded-lg -top-4 -right-4 bg-gradient-to-r from-red-500 to-red-400 animate-bounce"></div>
                                    <div className="absolute w-6 h-6 delay-700 rounded-full -bottom-4 -left-4 bg-gradient-to-r from-red-400 to-red-300 animate-bounce"></div>
                                    <div className="absolute w-4 h-4 delay-1000 rounded-full top-1/4 -left-6 bg-gradient-to-r from-red-600 to-red-500 animate-ping"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-24 text-red-100/40" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
        </>
    );
}