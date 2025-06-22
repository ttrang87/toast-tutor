export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ToastChatDB", 1)

        request.onerror = (event) => reject("DB error: " + event.target.errorCode)

        request.onsuccess = (event) => resolve(event.target.result)

        request.onupgradeneeded = (event) => {
            const db = event.target.result
            /* if not have chatBoxes table => create */
            if (!db.objectStoreNames.contains("chatBoxes")) {
                db.createObjectStore("chatBoxes", { keyPath: "id" }) // 'id' = chat_box_id
            }
        }
    })
}
/* A promise: Your request (action) was successfully sent — and now the system is working on it in the background. */
export async function saveChatBox(chatBox) {
    const db = await openDB()
    const tx = db.transaction("chatBoxes", "readwrite")
    const store = tx.objectStore("chatBoxes")
    await store.put(chatBox)
    return tx.complete
}


export async function getChatBox(chatBoxId) {
    const db = await openDB()
    const tx = db.transaction("chatBoxes", "readonly")
    const store = tx.objectStore("chatBoxes")
    return new Promise((resolve, reject) => {
        const request = store.get(chatBoxId)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
    })
}

export async function getAllChatBoxes() {
    const db = await openDB()
    const tx = db.transaction("chatBoxes", "readonly")
    const store = tx.objectStore("chatBoxes")
     return new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}