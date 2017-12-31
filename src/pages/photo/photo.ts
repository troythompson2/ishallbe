import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';

import Cropper from 'cropperjs';
import moment from 'moment';

import { HomePage } from '../home/home';

import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {
  @ViewChild('imageSrc') imageElement: ElementRef;

  uid: any;
  loader: any;
  imageMethod: any;
  cameraOptions: any;
  sourceType: any;
  cropperInstance: any;
  image: any;
  imageURL: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public camera: Camera,
    public storage: Storage,
    public firebase: FirebaseProvider
  ) {
  }

  ionViewDidLoad() {
    this.requestUID().then((uid) => {
      console.log("Got UID: " + uid)
      this.uid = uid;
    })
    this.askForImageRetrievalMethod();
  }

  requestUID() {
    return this.storage.ready().then(() => {
      return this.storage.get(('uid'));
    });
  }

  askForImageRetrievalMethod() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.sourceType = this.camera.PictureSourceType.CAMERA;
            this.getPicture();
          }
        },
        {
          text: 'Library',
          handler: () => {
            this.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY
            this.getPicture();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });

    actionSheet.present();
  }

  getPicture() {
    this.camera.getPicture(this.getCameraOptions()).then((image) => {
      console.log("Got image")
      console.log(image);
      this.imageElement.nativeElement.src = image;
      this.cropImage();
    });
  }

  getCameraOptions() {
    let cameraOpts: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.sourceType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: false,
      correctOrientation: true
    }
    return cameraOpts;
  }

  cropImage() {
    this.cropperInstance = new Cropper(this.imageElement.nativeElement, {
      aspectRatio: 3 / 3,
      dragMode: 'move',
      modal: true,
      guides: true,
      highlight: false,
      background: false,
      autoCrop: true,
      autoCropArea: 0.9,
      responsive: true,
      zoomable: true,
      movable: false
    });
  }

  uploadPhoto() {
    console.log("Uploading photo");
    this.startLoader();
    this.image = this.cropperInstance.getCroppedCanvas({ width: 500, height: 500 }).toDataURL('image/jpeg');
    let path = 'content/' + this.uid + '/images/profile/';
    this.store(path, this.image).subscribe((snapshot) => {
      console.log("Stored image");
      console.log(snapshot)
      this.imageURL = snapshot.downloadURL;
      this.confirm();
    });
  }

  store(path, obj) {
    return Observable.create((observer) => {
      let myPath = firebase.storage().ref(path);
      return myPath.putString(obj, 'data_url', { contentType: 'image/jpeg' }).
        then(function (snapshot) {
          observer.next(snapshot);
        }).catch((error: any) => {
          observer.next(error);
        });
    });
  }


  confirm() {
    console.log("Confirming")
    this.updatePhoto().then(() => {
      console.log("Finished updating photo")
      this.loader.dismiss();
      this.navCtrl.pop();
    })
  }

  startLoader() {
    this.loader = this.loadingCtrl.create({
      content: 'Please Wait..'
    });
    this.loader.present();
  }

  updatePhoto() {
    console.log("Updateing photo");
    let path = '/users/' + this.uid
    console.log("Path is " + path);
    let profile = {
      photo: this.imageURL
    }
    console.log("Profile object is");
    console.log(profile);
    return this.firebase.object(path).update(profile);
  }

}