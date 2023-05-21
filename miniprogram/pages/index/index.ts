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
  audioUrls: Record<number, string>;
}

interface IAppOption {
  globalData: {
    searchResult: SearchResult | null;
  };
  searchEntry: (keyword: string, callback: (result: SearchResult) => void) => void;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Page<IData, {}>({
  data: {
    searchResult: null,
    keyword: '',
    audioUrls: {},
  },
  
  onKeywordInput(event: any): void {
    if (event.detail.value !== this.data.keyword) {
      this.setData({
        searchResult: null,
        keyword: event.detail.value
      });
    }
  },

  onPlay(event: WechatMiniprogram.TouchEvent): void {
    let id = parseInt(event.currentTarget.id.replace("player-", ""));
    // Create an inner audio context
    const audioContext = wx.createInnerAudioContext({
      useWebAudioImplement: true,
    });

    // Set the audio URL
    console.log("id: " + id);
    console.log(this.data.audioUrls[id]);
    audioContext.src = this.data.audioUrls[id];

    // Start playing the audio
    audioContext.play();

    // Save the audio context in the page data
    this.setData({
      audioContext: audioContext,
    });
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
      if (result.entries) {
        let audioUrls: Record<number, string> = {};
        result.entries.forEach(async entry => {
          // Make a request to the server to fetch the m4a audio
          getAudioUrl(entry.id)
          .then((res: { audioUrl: string }) => {
            console.log("audioUrl:", res.audioUrl);
            audioUrls[entry.id] = res.audioUrl;
          })
          .catch((err: any) => {
            console.error('Failed to fetch audio:', err);
          });
          await sleep(10); 
        });
        // Save the audio URL in the page data
        this.setData({
          audioUrls: audioUrls,
        });
      }
      this.setData({
        searchResult: result
      });
    });
  }
});

/*

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