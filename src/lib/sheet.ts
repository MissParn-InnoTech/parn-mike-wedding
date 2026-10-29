// One Apps Script web app (bound to Wedding_Master_Plan_Parn_Mike) receives every guest response:
// RSVP, wishes + transfer slips, and guest photos. See Guest-Responses-AppsScript.gs.
export const SHEET_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxEoG7aNl7961mO_yJssdhNuhTs2_5unAlIvHMF5Ouf2GBIrnfZBjF3QKSXNceGtmicfQ/exec'

export async function postToSheet(payload: Record<string, unknown>) {
  await fetch(SHEET_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
}

export async function compressImage(file: File, maxDim = 1000, quality = 0.8): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}
