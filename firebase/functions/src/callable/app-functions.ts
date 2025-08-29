import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
// import { getMessaging } from "firebase-admin/messaging"; // For sending commands

const db = getFirestore();

/**
 * Callable function to add a new node to a farm.
 */
export const addNode = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be logged in.");
    }
    const { farmId, x, y } = request.data;
    if (!farmId || x === undefined || y === undefined) {
        throw new HttpsError("invalid-argument", "Required fields are missing.");
    }

    // Logic to generate a new node ID
    const nodesRef = db.collection(`farms/${farmId}/nodes`);
    const snapshot = await nodesRef.get();
    const highestId = snapshot.docs.reduce((max, doc) => {
        const idNum = parseInt(doc.id.replace('FS-N', ''), 10);
        return idNum > max ? idNum : max;
    }, 0);
    const newNodeId = `FS-N${String(highestId + 1).padStart(3, '0')}`;
    
    await nodesRef.doc(newNodeId).set({
        id: newNodeId,
        location: { x, y },
        status: 'inactive',
        battery: 100,
        health: 'ok',
        lastPing: null,
    });

    return { success: true, nodeId: newNodeId };
});

/**
 * Callable function to remove a node from a farm.
 */
export const removeNode = onCall(async (request) => {
     if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be logged in.");
    }
    const { farmId, nodeId } = request.data;
    if (!farmId || !nodeId) {
        throw new HttpsError("invalid-argument", "Required fields are missing.");
    }
    
    await db.doc(`farms/${farmId}/nodes/${nodeId}`).delete();

    return { success: true, message: `Node ${nodeId} removed.` };
});


/**
 * Callable function to send a command to a node.
 * This is a placeholder. A real implementation would use FCM or IoT Core.
 */
export const sendNodeCommand = onCall((request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be logged in.");
    }
    const { nodeId, farmId, command } = request.data;
    
    console.log(`Simulating sending command '${command}' to node '${nodeId}' on farm '${farmId}'.`);
    // In a real app:
    // const payload = { data: { command } };
    // await getMessaging().sendToDevice(deviceRegistrationToken, payload);

    return { success: true, message: `Command '${command}' sent to node ${nodeId}.`};
});


/**
 * Callable function to save a pest identification to the log.
 */
export const savePestIdentification = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be logged in to save data.");
    }

    const { farmId, isPest, pestName, description, impact, recommendations } = request.data;

    if (!farmId || !pestName) {
        throw new HttpsError("invalid-argument", "Required fields 'farmId' and 'pestName' are missing.");
    }
    
    if (!isPest) {
        // We could decide to not save non-pests, but for now we will.
        // Or throw: new HttpsError("invalid-argument", "Cannot log an item that is not a pest.");
    }

    const logData = {
        timestamp: FieldValue.serverTimestamp(),
        isPest,
        pestName,
        description,
        impact,
        recommendations,
        userId: request.auth.uid, // Save which user logged this
    };

    try {
        await db.collection(`farms/${farmId}/pest-log`).add(logData);
        return { success: true };
    } catch (error) {
        console.error("Error saving pest identification:", error);
        throw new HttpsError("internal", "An error occurred while saving the pest log.");
    }
});
