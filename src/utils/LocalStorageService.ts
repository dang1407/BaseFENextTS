export default class LocalStorageService {
  static getFeatureData() {
    return localStorage.getItem("FeatureData")!;
  }

  static setFeatureData(feature: unknown) {
    localStorage.setItem("FeatureData", feature?.toString() ?? '');
  }
}