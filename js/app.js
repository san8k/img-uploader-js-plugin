import { upload } from './upload';
import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCfzxJbhmADx47v_DH4qXlird0zTNeSazI',
  authDomain: 'img-uploader-a1124.firebaseapp.com',
  projectId: 'img-uploader-a1124',
  storageBucket: 'img-uploader-a1124.appspot.com',
  messagingSenderId: '1064849289860',
  appId: '1:1064849289860:web:65e5d52ee0f3a2e10c48d1',
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const options = {
  multi: true,
  fileExtensions: [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
  ],
  onUpload(files, previews) {
    files.forEach((file, i) => {
      const ref = storage.ref(`/img/${file.name}`);
      const task = ref.put(file);


      task.on('state_changed',
        (snapshot) => {
          const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
          const prev = previews[i].querySelector('.preview-info-progress');
          prev.textContent = percentage;
          prev.style.width = percentage + '%';
        },
        (error) => {
          console.error(error);
        },
        () => {
          task.snapshot.ref.getDownloadURL().then((url) => {
            console.log('Download url: ', url);
          })
        },
      );
    });
  },
};

upload('#file', options);
