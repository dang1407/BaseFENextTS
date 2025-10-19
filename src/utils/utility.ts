export default class Utility{
  static AppendSearchResult<T extends object, K extends keyof T>(oldList: T[] | undefined, newList: T[] | undefined, key: K) {
    oldList = oldList ?? [];
    newList = newList ?? [];
    const realNewList: T[] = [];
    // Gán thông tin của các object đã có nhưng thay đổi thay đổi
    newList.forEach(item => {
      const oldItem = oldList.find(n => n[key] == item[key]);
      if (oldItem) {
        Object.assign(oldItem, item);
      } else {
        realNewList.push(item);
      }
    });
    return [...oldList, ...realNewList];
  }
}