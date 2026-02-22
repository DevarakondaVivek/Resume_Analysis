'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Briefcase } from 'lucide-react';

interface UploadZoneProps {
    onAnalyze: (file: File, jobDescription: string) => void;
    isAnalyzing: boolean;
}

export default function UploadZone({ onAnalyze, isAnalyzing }: UploadZoneProps) {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
        },
        maxFiles: 1,
        disabled: isAnalyzing,
    });

    const handleSubmit = () => {
        if (file && jobDescription.trim()) {
            onAnalyze(file, jobDescription);
        }
    };

    const removeFile = () => setFile(null);

    return (
        <div className="upload-zone-container">
            <div className="upload-section">
                <h3 className="section-label">
                    <FileText size={20} />
                    Upload Resume
                </h3>

                {!file ? (
                    <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <div className="dropzone-icon">
                                <Upload size={32} />
                            </div>
                            <p className="dropzone-text">
                                {isDragActive
                                    ? 'Drop your resume here...'
                                    : 'Drag & drop your resume, or click to browse'}
                            </p>
                            <span className="dropzone-hint">Supports PDF, DOCX, TXT</span>
                        </div>
                    </div>
                ) : (
                    <div className="file-preview">
                        <div className="file-info">
                            <FileText size={20} />
                            <div>
                                <p className="file-name">{file.name}</p>
                                <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <button className="btn btn-icon" onClick={removeFile} disabled={isAnalyzing}>
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>

            <div className="upload-section">
                <h3 className="section-label">
                    <Briefcase size={20} />
                    Job Description
                </h3>
                <textarea
                    className="jd-textarea"
                    placeholder="Paste the job description here... Include the role title, requirements, qualifications, and any other relevant details."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    disabled={isAnalyzing}
                />
            </div>

            <button
                className="btn btn-primary btn-analyze"
                onClick={handleSubmit}
                disabled={!file || !jobDescription.trim() || isAnalyzing}
            >
                {isAnalyzing ? (
                    <>
                        <div className="spinner" />
                        Analyzing...
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Analyze Resume
                    </>
                )}
            </button>
        </div>
    );
}

function Sparkles({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
