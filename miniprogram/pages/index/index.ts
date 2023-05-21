// audioPage.ts

import { getAudioUrl, search } from "../../utils/util";

// index.ts

interface SearchResult {
  notFound?: boolean;
  entries?: Entry[];
  pronunciations?: string[];
}

interface Entry {
  annotation: string;
  category: string;
  definitions: Definition[];
  id: number;
  phoneticCharacters: boolean;
  pinyin: string;
  word: string;
}

interface Definition {
  definition: string;
  examples: string[];
}

interface IData {
  searchResult: SearchResult | null;
  keyword: string;
  audioUrl: string;
}

interface IAppOption {
  globalData: {
    searchResult: SearchResult | null;
  };
  searchEntry: (keyword: string, callback: (result: SearchResult) => void) => void;
}

Page<IData, {}>({
  data: {
    searchResult: null,
    keyword: '',
    audioUrl: '',
  },
  
  onKeywordInput(event: any): void {
    if (event.detail.value !== this.data.keyword) {
      this.setData({
        searchResult: null,
        keyword: event.detail.value
      });
    }
  },
  
  onSearch(): void {
    const keyword = this.data.keyword.trim();
    
    if (keyword === '') {
      wx.showToast({
        title: '请输入汉字或拼音',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '搜索中...'
    });
  
    console.log("Searching keyword: " + keyword);
    search(keyword, (result: SearchResult): void => {
      wx.hideLoading();
      this.setData({
        searchResult: result
      });
    });
  }
});

/*
// Make a request to the server to fetch the m4a audio
getAudioUrl(fileId)
.then((res: { audioUrl: string }) => {
  console.log("audioUrl:", res.audioUrl)
  // Save the audio URL in the page data
  this.setData({
    audioUrl: res.audioUrl,
  });
})
.catch((err: any) => {
  console.error('Failed to fetch audio:', err);
});
  playAudio() {
    console.log("playAudio");
    // Create an inner audio context
    const audioContext = wx.createInnerAudioContext({
      useWebAudioImplement: true,
    });

    // Set the audio URL
    console.log(this.data.audioUrl);
    audioContext.src = this.data.audioUrl;

    // Start playing the audio
    audioContext.play();

    // Save the audio context in the page data
    this.setData({
      audioContext: audioContext,
    });
  },

  onUnload() {
    const audioContext = this.data.audioContext;

    // Stop playing the audio and release the audio context
    if (audioContext) {
      audioContext.stop();
      audioContext.destroy();
    }
  },
});
*/