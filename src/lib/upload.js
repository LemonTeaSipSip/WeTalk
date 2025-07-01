import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const upload = async (file) => {
    if (!file) {
        throw new Error("No file selected.");
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error("File size exceeds the 10MB limit.");
    }

    const storage = getStorage();
    const storageRef = ref(storage, `images/${Date.now() + file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error); // Handle upload errors
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};

export default upload;
