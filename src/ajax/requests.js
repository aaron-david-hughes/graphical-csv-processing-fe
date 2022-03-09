import Axios from "axios";

export function graphicalCsvProcessingAPI(formContent, filename, addBanner, backend, loading) {
    const formData = new FormData();

    if (!formContent || !formContent.files || !formContent.graphData) return;

    formContent.files.forEach(file => {
        formData.append('csvFiles', file.file);
    });
    formData.append('graph', JSON.stringify({
        ...formContent.graphData, defaultValues: {}
    }));

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: false,
        responseType: 'blob'
    }

    if (process.env.REACT_APP_BACKEND) {
        backend = process.env.REACT_APP_BACKEND;
    }

    if (
        formContent &&
        formContent.files && formContent.files.length > 0 &&
        formContent.graphData &&
        formContent.graphData.nodes && formContent.graphData.nodes.length > 0
    ) {
        Axios.post(backend, formData, config).then(response => {
            saveFile(response.data, filename);
            loading(false);
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
            loading(false);
        });
    }
}

export function saveFile(data, filename) {
    const link = document.createElement("a");
    link.target = "_blank";
    link.download = filename;

    link.href = URL.createObjectURL(
        data
    );
    link.click();
}