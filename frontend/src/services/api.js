const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const analyzeResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(`${API_URL}/resumes/analyze`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: response.statusText };
        }
        throw new Error(errorData.message || 'Analysis failed');
    }

    return await response.json();
};

export const exportAnalysisPdf = async (id) => {
    // This is a direct download link, but if we need auth or error handling:
    try {
        const response = await fetch(`${API_URL}/resumes/${id}/export`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Export failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-roast-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error("Download error:", error);
        console.error("Error details:", error.message);
        alert(`PDF download failed: ${error.message}`);
        throw error;
    }
};

