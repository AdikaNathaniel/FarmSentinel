
import { https } from "firebase-functions";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const db = getFirestore();
const storage = getStorage();

/**
 * HTTP-triggered function for a node to report its status (ping).
 * The node should send its ID, battery level, and status.
 */
export const nodePing = https.onRequest(async (request, response) => {
    const { nodeId, battery, status, farmId } = request.body;

    if (!nodeId || !farmId) {
        response.status(400).send("Missing required fields: nodeId and farmId.");
        return;
    }

    try {
        const nodeRef = db.collection(`farms/${farmId}/nodes`).doc(nodeId);
        await nodeRef.update({
            status: status || 'active',
            battery: battery || null,
            lastPing: FieldValue.serverTimestamp(),
            health: battery < 20 ? 'warning' : 'ok'
        });

        // Log the connection event
        await db.collection(`farms/${farmId}/logs`).add({
            nodeId,
            eventType: 'connection',
            details: `Node pinged with battery ${battery}%.`,
            timestamp: FieldValue.serverTimestamp(),
        });

        response.status(200).send({ success: true, message: `Node ${nodeId} status updated.`});
    } catch (error) {
        console.error(`Error updating node ${nodeId}:`, error);
        response.status(500).send("Internal Server Error");
    }
});

/**
 * HTTP-triggered function for a node to report a bird detection alert.
 * The node sends its ID, a captured image (as base64), and severity.
 */
export const nodeAlert = https.onRequest(async (request, response) => {
    const { nodeId, farmId, imageBase64, severity } = request.body;

    if (!nodeId || !farmId || !imageBase64 || !severity) {
        response.status(400).send("Missing required fields: nodeId, farmId, imageBase64, severity.");
        return;
    }

    try {
        // 1. Upload image to Cloud Storage
        const bucket = storage.bucket();
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const fileName = `alerts/${farmId}/${nodeId}_${Date.now()}.jpg`;
        const file = bucket.file(fileName);

        await file.save(imageBuffer, {
            metadata: { contentType: 'image/jpeg' },
        });
        
        // Make the file public for easy access on the frontend
        await file.makePublic();
        const photoUrl = file.publicUrl();

        // 2. Create alert document in Firestore
        await db.collection(`farms/${farmId}/alerts`).add({
            nodeId,
            farmId,
            timestamp: FieldValue.serverTimestamp(),
            severity,
            photoUrl
        });

        response.status(200).send({ success: true, photoUrl });

    } catch (error) {
        console.error(`Error processing alert for node ${nodeId}:`, error);
        response.status(500).send("Internal Server Error");
    }
});
