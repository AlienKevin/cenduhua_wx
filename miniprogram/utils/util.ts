export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

interface GetAudioUrlResponse {
  audioUrl: string;
}

export function getAudioUrl(fileId: number, maxRetries: number = 3): Promise<GetAudioUrlResponse> {
  return new Promise((resolve, reject) => {
    const download = (retryCount: number) => {
      wx.cloud.downloadFile({
        fileID: `cloud://server-0gti088gd0c65630.7365-server-0gti088gd0c65630-1318372019/sounds/${fileId}.mp3`,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve({ audioUrl: res.tempFilePath });
          } else {
            const error = new Error(`Failed to download audio. Status code: ${res.statusCode}`);
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying (${retryCount}/${maxRetries})...`);
              download(retryCount);
            } else {
              reject(error);
            }
          }
        },
        fail: (err) => {
          const error = new Error(`Failed to download audio: ${err.errMsg}`);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying (${retryCount}/${maxRetries})...`);
            download(retryCount);
          } else {
            reject(error);
          }
        }
      });
    };

    download(0);
  });
}


  
export function search(keyword: string, callback: (result: Record<string, any>) => void): void {
  // Simulate API call to retrieve search results
  let res = wx.cloud.callContainer({
    "config": {
      "env": "server-0gti088gd0c65630"
    },
    "path": `/search/${encodeURIComponent(keyword)}`,
    "header": {
      "X-WX-SERVICE": "cenduhua",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": ""
  });
  res.then((res) => {
    callback(res.data as Record<string, any>);
  }).catch((err) => {
      console.error(err);
      callback({ notFound: true });
  });
}