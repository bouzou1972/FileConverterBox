export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function generateBulkUUIDs(count: number): string[] {
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(generateUUID());
  }
  return uuids;
}
