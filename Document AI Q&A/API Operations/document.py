async function fetchDocumentEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68bbf8515a17179b1ece88bb/entities/Document`, {
        headers: {
            'api_key': '7bba47554289433495881ec8a81a96f0', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}
async function updateDocumentEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68bbf8515a17179b1ece88bb/entities/Document/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '7bba47554289433495881ec8a81a96f0', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}