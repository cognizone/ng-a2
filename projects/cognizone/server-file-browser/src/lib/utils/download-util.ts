// todo: use from model-utils in the future

export class DownloadUtil {
  static popup(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    window.open(url);
    URL.revokeObjectURL(url);
  }

  static link(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    URL.revokeObjectURL(url);
  }
}
