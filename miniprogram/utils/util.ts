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

export function getAudioUrl(fileId: number): Promise<GetAudioUrlResponse> {
  // Return a promise to simulate an asynchronous HTTP request
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: `${getApp().globalData.serverUrl}/audio/${fileId}`,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve({ audioUrl: res.tempFilePath });
        } else {
          reject(new Error(`Failed to download audio. Status code: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(new Error(`Failed to download audio: ${err.errMsg}`));
      },
    });
  });
}

  
export function search(keyword: string, callback: (result: Record<string, any>) => void): void {
  // Simulate API call to retrieve search results
  wx.request({
    url: `${getApp().globalData.serverUrl}/search/${keyword}`,
    success: function(res) {
      callback(res.data as Record<string, any>);
    },
    fail: function(res) {
      console.error(res);
      callback({ notFound: true });
    }
  });
}