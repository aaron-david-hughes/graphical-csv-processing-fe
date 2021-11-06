import Axios from "axios";

export function graphicalCsvProcessingAPI(formContent, fileName) {
    const link = document.createElement("a");
    link.target = "_blank";
    link.download = fileName ? fileName : 'CsvProcessingResults.csv';

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

    Axios.post('http://localhost:8080/process', formData, config).then(response => {
        link.href = URL.createObjectURL(
            new Blob([response.data])
        );
        link.click();
    }).catch(error => {
        console.log(error);
    });
}