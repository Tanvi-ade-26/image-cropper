import { Component, VERSION } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, Observer } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'imageCropperTool';
  name = "Angular " + VERSION.major;
  imgChangeEvt: any = "";
  cropImgPreview: any = "";
  base64Image: any;
  titleShow: boolean = false;

  //on file select
  onFileChange(event: any): void {
    this.imgChangeEvt = event;
    this.titleShow = true;
  }

  //crop the image
  cropImg(e: ImageCroppedEvent){
    this.cropImgPreview = e.base64
  }

  imgLoad() {
    // display cropper tool
  }

  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }

  //download the image
  downloadImage() {
    let imageUrl = this.cropImgPreview;

    this.getBase64ImageFromURL(imageUrl).subscribe((base64data: string) => {
      console.log(base64data);
      this.base64Image = "data:image/jpg;base64," + base64data;
      // save image to disk
      var link = document.createElement("a");

      document.body.appendChild(link); // for Firefox

      link.setAttribute("href", this.base64Image);
      link.setAttribute("download", "mrHankey.jpg");
      link.click();
    });
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) { 
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  //clear image in card
  clearImage() {
    this.imgChangeEvt = "";
    this.cropImgPreview = "";
    this.titleShow = false;
  }
}
