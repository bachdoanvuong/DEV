export const detectExplicitContent = async (image, setResult) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];

        // Create a request object
        const request = {
            requests: [
                {
                    image: {
                        content: base64Image
                    },
                    features: [
                        {
                            type: 'SAFE_SEARCH_DETECTION'
                        }
                    ]
                }
            ]
        };

        // Send the request to the Cloud Vision API
        const response = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${process.env.REACT_APP_GOOGLE_CLOUD_VISION}`,
            {
                method: 'POST',
                body: JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Parse the response
        const data = await response.json();
        const detections = data.responses[0].safeSearchAnnotation;

        setResult(detections);
    };
}