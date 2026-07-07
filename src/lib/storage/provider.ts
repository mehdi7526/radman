export type StoredAsset = {
  url: string;
  alt: string;
};

export type StorageProvider = {
  resolve(url: string, alt: string): StoredAsset;
};

const urlStorage: StorageProvider = {
  resolve(url, alt) {
    return { url, alt };
  }
};

export function getStorageProvider() {
  return urlStorage;
}
