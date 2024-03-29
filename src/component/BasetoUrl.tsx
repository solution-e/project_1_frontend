export default function baseToUrl(base64DataArray: string[]): Blob[] {
  const contentType = 'image/png';
  
  const blobs = base64DataArray.map((base64Data) => {
      const byteCharacters = atob(base64Data.replace(/^.*,/, ''));
      const byteArray = new Uint8Array(byteCharacters.length);
    
      for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
      }
    
      
      return new Blob([byteArray.buffer], { type: contentType });
  });
  
    return blobs;
  }
  