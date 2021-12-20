import Axios from "axios";

export function graphicalCsvProcessingAPI(formContent, fileName, addBanner) {
    const link = document.createElement("a");
    link.target = "_blank";
    link.download = fileName;

    const formData = new FormData();
    formContent.files.forEach(file => {
        formData.append('csvFiles', file);
    });
    formData.append('graph', JSON.stringify(formContent.graphData));

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: false,
        responseType: 'blob'
    }

    if (formContent && formContent.files && formContent.files.length > 0 && formContent.graphData &&
        formContent.graphData.nodes && formContent.graphData.nodes.length > 0) {
        Axios.post(process.env.REACT_APP_CONFIG.backend, formData, config).then(response => {
            link.href = URL.createObjectURL(
                response.data
            );
            link.click();
        }).catch(async error => {
            if (error.response) {
                let text = await error.response.data.text();
                addBanner({
                    msg: `Response code ${error.response.status}: ${text}`,
                    type: 'failure'
                });
            } else {
                addBanner({
                    msg: 'An internal error has occurred',
                    type: 'failure'
                });
            }
        });
    }
}