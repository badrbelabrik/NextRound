const imageHelper = (image) => {
    if (!image) {
        return null;
    }

    return `http://127.0.0.1:8000/storage/${image}`;
};

export default imageHelper;