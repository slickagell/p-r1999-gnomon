import {
  blurARGB,
  dilate,
  invertColors,
  thresholdFilter,
} from "@scripts/image-processing";
import { createWorker, recognize } from "tesseract.js";

const RESET_PERIODICAL_RECOGNIZE_TIMES = 10;

export default () => ({
  activeTab: "stream",
  videoLoaded: false,
  lastMouseY: 0,
  lastMouseX: 0,
  mouseX: 0,
  mouseY: 0,
  mouseDown: false,
  rect: {},
  imageData: null,
  //* Elements
  worker: null,
  video: null,
  canvas: null,
  output: null,
  captureImg: null,
  ctx: null,
  uploadFile: null,
  //* Options
  isAutoMode: true,
  isPreprocess: false,
  isShowImage: true,
  isShowArea: true,
  isDilate: true,
  isInvertColor: true,
  isBinarize: true,
  blurImageRadius: 0,
  binarizeThreshold: 50,
  recognizeTimes: 0,

  init() {
    this.video = this.$refs.video;
    this.canvas = this.$refs.videoAreaCanvas;
    this.output = this.$refs.output;
    this.captureImg = this.$refs.captureImg;
    this.ctx = this.canvas.getContext("2d");
    this.initWorker();
  },

  initWorker() {
    (async () => {
      const worker = await createWorker("eng");

      await worker.setParameters({ preserve_interword_spaces: "1" });

      this.worker = worker;
    })();
  },

  reset() {
    this.videoLoaded = false;
    this.lastMouseY = 0;
    this.lastMouseX = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.rect = {};
    this.uploadFile = null;
    this.imageData = null;
    this.video.srcObject = null;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.activeTab === "upload") {
      this.$refs.fileInput.value = "";
      this.$refs.imgCanvas
        .getContext("2d")
        .clearRect(
          0,
          0,
          this.$refs.imgCanvas.width,
          this.$refs.imgCanvas.height
        );
    }
  },

  async startCapture() {
    try {
      this.video.srcObject = await navigator.mediaDevices.getDisplayMedia({
        video: {
          // cursor: "always",
        },
        audio: false,
      });
    } catch (err) {
      console.error("Error" + err);
    }
  },

  initCanvas() {
    if (!this.videoLoaded) {
      this.startCapture();
    }
  },

  initUploadCanvas(e) {
    let img = new Image();
    const imgCanvas = this.$refs.imgCanvas;
    const imgCanvasCtx = this.$refs.imgCanvas.getContext("2d");
    const canvas = this.canvas;
    img.onload = function () {
      imgCanvas.width = img.width;
      imgCanvas.height = img.height;
      imgCanvasCtx.drawImage(img, 0, 0);
      canvas.width = img.width;
      canvas.height = img.height;
    };
    img.src = URL.createObjectURL(e.target.files[0]);
    this.uploadFile = img;
  },

  resizeCanvas(element) {
    this.canvas.width = element.offsetWidth;
    this.canvas.height = element.offsetHeight;
  },

  videoOnLoad(e) {
    this.videoLoaded = true;
    this.resizeCanvas(e.target);
  },

  recognizeImage(img) {
    (async () => {
      const {
        data: { text },
      } = await this.worker.recognize(img);
      // writeIntoHtml("Result: " + text);
      this.output.innerHTML = text;
      this.recognizeTimes++;
      if (this.recognizeTimes > RESET_PERIODICAL_RECOGNIZE_TIMES) {
        await this.worker.terminate();
        this.recognizeTimes = 0;
        this.initWorker();
      }
    })();
  },

  preprocessImage(canvas) {
    const processedImageData = canvas
      .getContext("2d")
      .getImageData(0, 0, canvas.width, canvas.height);

    if (this.blurImageRadius > 0) {
      blurARGB(processedImageData.data, canvas, this.blurImageRadius / 100);
    }

    if (this.isDilate) {
      dilate(processedImageData.data, canvas);
    }

    if (this.isInvertColor) {
      invertColors(processedImageData.data);
    }

    if (this.isBinarize) {
      thresholdFilter(processedImageData.data, this.binarizeThreshold / 100);
    }
    return processedImageData;
  },

  renderPreprocessedImage() {
    const { width, height, x, y } = this.rect;
    let img;
    if (this.activeTab === "upload") {
      img = {
        data: this.uploadFile,
        width: this.uploadFile.width,
        height: this.uploadFile.height,
      };
    } else {
      img = {
        data: this.video,
        width: this.video.videoWidth,
        height: this.video.videoHeight,
      };
    }
    const aspectRatioY = img.height / this.canvas.height;
    const aspectRatioX = img.width / this.canvas.width;

    const offsetY = 0.5 * aspectRatioY;

    let cv2 = document.createElement("canvas");
    cv2.width = width * aspectRatioX;
    cv2.height = height * aspectRatioY;
    let ctx2 = cv2.getContext("2d");
    if (!ctx2) return;

    ctx2.drawImage(
      img.data,
      x * aspectRatioX,
      (y + offsetY) * aspectRatioY,
      width * aspectRatioX,
      (height - offsetY) * aspectRatioY,
      0,
      0,
      cv2.width,
      cv2.height
    );

    if (this.isPreprocess) {
      ctx2.putImageData(this.preprocessImage(cv2), 0, 0);
    }

    this.imageData = cv2.toDataURL("image/jpg");
    if (this.isShowImage) {
      this.captureImg.hidden = false;
      this.captureImg.src = this.imageData;
    } else {
      this.captureImg.hidden = true;
    }
  },

  updatePreprocessedImage() {
    this.renderPreprocessedImage();
    this.recognizeImage(this.imageData);
  },

  showLoadingOCR() {
    this.output.innerHTML = "Extracting text...";
  },

  mouseDownOnCanvas(e) {
    let rect = this.canvas.getBoundingClientRect();

    this.lastMouseX = e.clientX - rect.left;
    this.lastMouseY = e.clientY - rect.top;
    this.mouseDown = true;
  },

  mouseMoveOnCanvas(e) {
    let rect = this.canvas.getBoundingClientRect();

    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;

    if (this.mouseDown) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //clear canvas
      this.ctx.beginPath();
      let width = this.mouseX - this.lastMouseX;
      let height = this.mouseY - this.lastMouseY;
      this.ctx.rect(this.lastMouseX, this.lastMouseY, width, height);
      this.rect = { x: this.lastMouseX, y: this.lastMouseY, width, height };
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  },

  mouseUpOnCanvas() {
    this.mouseDown = false;

    if (this.rect.width > 0) {
      if (this.isAutoMode) {
        let automodeIntevalId;

        this.showLoadingOCR();
        automodeIntevalId = setInterval(this.updatePreprocessedImage(), 500);

        setTimeout(() => {
          clearInterval(automodeIntevalId);
        }, 700);
      } else {
        this.showLoadingOCR();
        this.updatePreprocessedImage();
        this.$refs.hint.innerHTML = "Click on stream to refresh.";
      }
    }
  },

  toggleAutoMode() {
    this.isAutoMode = !this.isAutoMode;
    let automodeIntevalId;
    if (this.isAutoMode) {
      automodeIntevalId = setInterval(this.updatePreprocessedImage(), 500);
    } else {
      clearInterval(automodeIntevalId);
    }
  },

  toggleShowImage() {
    this.isShowImage = !this.isShowImage;
    if (this.isShowImage) {
      this.captureImg.hidden = false;
      this.captureImg.src = this.imageData;
    } else {
      this.captureImg.hidden = true;
    }
  },

  togglePreprocess() {
    this.isPreprocess = !this.isPreprocess;
    let preprocessIntevelId;
    if (this.isPreprocess) {
      preprocessIntevelId = setInterval(this.updatePreprocessedImage(), 500);
    } else {
      clearInterval(preprocessIntevelId);
    }
  },

  toggleShowArea() {
    this.isShowArea = !this.isShowArea;
    if (this.isShowArea) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //clear canvas
      this.ctx.beginPath();
      this.ctx.rect(
        this.rect.x,
        this.rect.y,
        this.rect.width,
        this.rect.height
      );
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    } else if (this.rect.width > 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //clear canvas
    }
  },

  toggleDilate() {
    this.isDilate = !this.isDilate;
    this.updatePreprocessedImage();
  },

  toggleInvertColor() {
    this.isInvertColor = !this.isInvertColor;
    this.updatePreprocessedImage();
  },

  toggleBinarize() {
    this.isBinarize = !this.isBinarize;
    this.updatePreprocessedImage();
  },

  onChangeBlurImageRadius(e) {
    this.blurImageRadius = parseInt(e.target.value, 10);
    this.renderPreprocessedImage();
  },

  updateBlurImageRadius(e) {
    this.blurImageRadius = parseInt(e.target.value, 10);
    this.updatePreprocessedImage();
  },

  onChangeBinarizeThreshold(e) {
    this.binarizeThreshold = parseInt(e.target.value, 10);
    this.renderPreprocessedImage();
  },

  updateBinarizeThreshold(e) {
    this.binarizeThreshold = parseInt(e.target.value, 10);
    this.updatePreprocessedImage();
  },

  handleChangeActiveTab(tab) {
    this.activeTab = tab;

    if (tab === "upload") {
      this.canvas = this.$refs.fileAreaCanvas;
    } else {
      this.canvas = this.$refs.videoAreaCanvas;
    }
    this.ctx = this.canvas.getContext("2d");
  },
});
