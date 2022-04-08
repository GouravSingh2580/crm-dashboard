import { CONFIG } from 'config';

export class ViewSDKClient {
  constructor() {
    this.readyPromise = new Promise((resolve) => {
      if (window.AdobeDC) {
        resolve();
      } else {
        document.addEventListener("adobe_dc_view_sdk.ready", () => {
          resolve();
        });
      }
    });
    this.adobeDCView = undefined;
  }

  ready() {
    return this.readyPromise;
  }

  previewFile(divId, viewerConfig, blob, filename) {
    const config = {
      clientId: CONFIG.adobePDFPreviewKey,
    };
    if (divId) {
      config.divId = divId;
    }
    const filePromise = Promise.resolve(blob.arrayBuffer())
    this.adobeDCView = new window.AdobeDC.View(config);
    return this.adobeDCView.previewFile({
      content: {
        promise: filePromise,
      },
      metaData: {
        fileName: filename,
        id: "6d07d124-ac8",
      }
    }, viewerConfig);
  }

  previewFileUsingFilePromise(divId, filePromise, fileName) {
    this.adobeDCView = new window.AdobeDC.View({
      clientId: CONFIG.adobePDFPreviewKey,
      divId,
    });
    this.adobeDCView.previewFile({
      content: {
        promise: filePromise,
      },
      metaData: {
        fileName
      }
    }, {});
  }

  registerSaveApiHandler() {
    const saveApiHandler = (metaData) => new Promise(resolve => {
        setTimeout(() => {
          const response = {
            code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
            data: {
              metaData: Object.assign(metaData, { updatedAt: new Date().getTime() })
            },
          };
          resolve(response);
        }, 2000);
      });
    this.adobeDCView.registerCallback(
      window.AdobeDC.View.Enum.CallbackType.SAVE_API,
      saveApiHandler,
      {}
    );
  }

  registerEventsHandler() {
    this.adobeDCView.registerCallback(
      window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
      (event) => {
        // eslint-disable-next-line no-console
        // we could add tracking to pdf viewing later if needed
        console.log('event', event);
      },
      {
        enablePDFAnalytics: true,
      }
    );
  }
}